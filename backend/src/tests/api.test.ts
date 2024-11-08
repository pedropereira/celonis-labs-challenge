import { app } from "../app";
import http from "http";
import { expect, it, describe, beforeAll, beforeEach, afterAll } from "@jest/globals";
import { prisma } from "../prisma";
import { randomUUID } from "crypto";
import { UserDTO, TenantDTO, ErrorDTO } from "../dtos";

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
    describe("POST /make-tenant", () => {
      it("creates a new tenant", async () => {
        const response = await fetch(`${baseUrl}/make-tenant/TestTenant`);
        const tenant = (await response.json()) as TenantDTO;

        expect(response.status).toBe(201);
        expect(tenant.id).toBeDefined();
        expect(tenant.name).toBe("TestTenant");
        expect(tenant.createdAt).toBeDefined();
        expect(tenant.updatedAt).toBeDefined();
      });
    });

    describe("GET /show-tenants", () => {
      it("lists all tenants", async () => {
        await createTenant();

        const response = await fetch(`${baseUrl}/show-tenants`);
        const tenants = (await response.json()) as TenantDTO[];

        expect(response.status).toBe(200);
        expect(tenants.length).toBe(1);
        expect(tenants[0].id).toBeDefined();
        expect(tenants[0].name).toBe("TestTenant");
        expect(tenants[0].createdAt).toBeDefined();
        expect(tenants[0].updatedAt).toBeDefined();
      });
    });

    describe("GET /send-user-tenant/:email", () => {
      it("gets tenant by user email", async () => {
        const tenant = await createTenant();
        await createUser({ tenantId: tenant.id });

        const response = await fetch(`${baseUrl}/send-user-tenant/test@example.com`);
        const fetchedTenant = (await response.json()) as TenantDTO;

        expect(response.status).toBe(200);
        expect(fetchedTenant.id).toBe(tenant.id);
        expect(fetchedTenant.name).toBe(tenant.name);
      });

      it("returns 404 for non-existent user", async () => {
        const response = await fetch(`${baseUrl}/send-user-tenant/nonexistent@example.com`);
        const result = (await response.json()) as ErrorDTO;

        expect(response.status).toBe(404);
        expect(result.error).toBe("Not Found");
        expect(result.statusCode).toBe("404");
        expect(result.messages).toEqual(["Tenant not found"]);
      });
    });

    describe("POST /delete-tenant", () => {
      it("deletes a tenant by name", async () => {
        const tenant = await createTenant();

        const response = await fetch(`${baseUrl}/delete-tenant?name=${tenant.name}`, {
          method: "POST",
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

  describe("PUT /put-user-to-tenant/:email/:name", () => {
    it("assigns user to a different tenant", async () => {
      const tenant1 = await createTenant({ name: "FirstTenant" });
      const tenant2 = await createTenant({ name: "SecondTenant" });
      await createUser({ tenantId: tenant1.id });

      const response = await fetch(
        `${baseUrl}/put-user-to-tenant/test@example.com/${tenant2.name}`,
        {
          method: "PUT",
        }
      );
      const result = (await response.json()) as UserDTO;

      expect(response.status).toBe(200);
      expect(result.tenantId).toBe(tenant2.id);
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
