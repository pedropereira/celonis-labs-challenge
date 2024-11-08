import { app } from "../app";
import http from "http";
import { expect, it, describe, beforeAll, beforeEach, afterAll } from "@jest/globals";
import { prisma } from "../prisma";
import { randomUUID } from "crypto";
import { UserDTO, TenantDTO } from "../dtos";

describe("API Endpoints", () => {
  let server: http.Server;
  const port = 3001;
  const baseUrl = `http://localhost:${port}`;

  const createTenant = async ({ name = "TestTenant", id = randomUUID().toString() } = {}) => {
    const tenant = await prisma.tenant.create({
      data: {
        id: id,
        name: name,
      },
    });

    return tenant;
  };

  const createUser = async ({
    id = randomUUID().toString(),
    email = "test@example.com",
    name = "Test User",
    tenantId = randomUUID().toString(),
  } = {}) => {
    const user = await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name,
        tenantId: tenantId,
      },
    });

    return user;
  };

  beforeAll((done) => {
    server = app.listen(port, done);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          console.error("Error closing the server:", error);

          reject(error);
        } else {
          resolve();
        }
      });
    });
  });

  describe("Health Check Endpoint", () => {
    describe("GET /", () => {
      it("returns health status", async () => {
        const response = await fetch(`${baseUrl}/`);
        const result = (await response.json()) as { healthy: boolean };

        expect(response.status).toBe(200);
        expect(result).toEqual({ healthy: true });
      });
    });
  });

  describe("Tenant Endpoints", () => {
    describe("POST /v1/tenants", () => {
      it("creates a new tenant", async () => {
        const response = await fetch(`${baseUrl}/v1/tenants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: "TestTenant" }),
        });
        const tenant = (await response.json()) as TenantDTO;

        expect(response.status).toBe(201);
        expect(tenant.id).toBeDefined();
        expect(tenant.name).toBe("TestTenant");
        expect(tenant.createdAt).toBeDefined();
        expect(tenant.updatedAt).toBeDefined();
      });
    });

    describe("PATCH /v1/tenants/:id", () => {
      it("updates tenant name", async () => {
        const tenant = await createTenant();
        const newName = "Updated Name";

        const response = await fetch(`${baseUrl}/v1/tenants/${tenant.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        });
        const updatedTenant = (await response.json()) as TenantDTO;

        expect(response.status).toBe(200);
        expect(updatedTenant.name).toBe(newName);
      });
    });

    describe("GET /v1/tenants", () => {
      it("lists all tenants", async () => {
        await createTenant();

        const response = await fetch(`${baseUrl}/v1/tenants`);
        const tenants = (await response.json()) as TenantDTO[];

        expect(response.status).toBe(200);
        expect(tenants.length).toBe(1);
        expect(tenants[0].id).toBeDefined();
        expect(tenants[0].name).toBe("TestTenant");
        expect(tenants[0].createdAt).toBeDefined();
        expect(tenants[0].updatedAt).toBeDefined();
      });
    });

    describe("GET /v1/tenants/:id", () => {
      it("gets tenant by id", async () => {
        const tenant = await createTenant();

        const response = await fetch(`${baseUrl}/v1/tenants/${tenant.id}`);
        const fetchedTenant = (await response.json()) as TenantDTO;

        expect(response.status).toBe(200);
        expect(fetchedTenant.id).toBe(tenant.id);
        expect(fetchedTenant.name).toBe(tenant.name);
        expect(fetchedTenant.createdAt).toBeDefined();
        expect(fetchedTenant.updatedAt).toBeDefined();
      });
    });

    describe("DELETE /v1/tenants/:id", () => {
      it("deletes a tenant by id", async () => {
        const tenant = await createTenant();

        const response = await fetch(`${baseUrl}/v1/tenants/${tenant.id}`, {
          method: "DELETE",
        });

        expect(response.status).toBe(200);
      });
    });
  });

  describe("User Endpoints", () => {
    describe("POST /v1/users", () => {
      it("creates a new user", async () => {
        const tenant = await createTenant();
        const userName = "Test User";
        const userEmail = "test@example.com";

        const response = await fetch(`${baseUrl}/v1/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            name: userName,
            tenantId: tenant.id,
          }),
        });
        const user = (await response.json()) as UserDTO;

        expect(response.status).toBe(201);
        expect(user.id).toBeDefined();
        expect(user.email).toBe(userEmail);
        expect(user.name).toBe(userName);
        expect(user.tenantId).toBe(tenant.id);
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
      });
    });

    describe("GET /v1/users", () => {
      it("lists all users", async () => {
        const tenant = await createTenant();
        await createUser({ tenantId: tenant.id });

        const response = await fetch(`${baseUrl}/v1/users`);
        const users = (await response.json()) as UserDTO[];

        expect(response.status).toBe(200);
        expect(users.length).toBe(1);
      });
    });

    describe("GET /v1/users/:id", () => {
      it("gets user by id", async () => {
        const tenant = await createTenant();
        const user = await createUser({ tenantId: tenant.id });

        const response = await fetch(`${baseUrl}/v1/users/${user.id}`);
        const fetchedUser = (await response.json()) as UserDTO;

        expect(response.status).toBe(200);
        expect(fetchedUser.id).toBe(user.id);
        expect(fetchedUser.email).toBe(user.email);
        expect(fetchedUser.name).toBe(user.name);
        expect(fetchedUser.tenantId).toBe(tenant.id);
        expect(fetchedUser.createdAt).toBeDefined();
        expect(fetchedUser.updatedAt).toBeDefined();
      });
    });
  });

  describe("PATCH /v1/users/:id", () => {
    it("updates user name", async () => {
      const tenant = await createTenant();
      const user = await createUser({ tenantId: tenant.id });
      const newName = "Updated Name";

      const response = await fetch(`${baseUrl}/v1/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      const updatedUser = (await response.json()) as UserDTO;

      expect(response.status).toBe(200);
      expect(updatedUser.name).toBe(newName);
      expect(updatedUser.id).toBe(user.id);
    });
  });

  describe("DELETE /v1/users/:id", () => {
    it("deletes a user by id", async () => {
      const tenant = await createTenant();
      const user = await createUser({ tenantId: tenant.id });

      const response = await fetch(`${baseUrl}/v1/users/${user.id}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(200);
    });
  });
});
