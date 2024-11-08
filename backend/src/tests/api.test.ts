import { app } from "../app";
import http from "http";
import { expect, it, describe, beforeAll, beforeEach, afterAll } from "@jest/globals";
import { prisma } from "../prisma";
import { randomUUID } from "crypto";

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
      server.close((err) => {
        if (err) {
          console.error("Error closing the server:", err);
          reject(err);
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual({ healthy: true });
      });
    });
  });

  describe("Tenant Endpoints", () => {
    describe("POST /make-tenant", () => {
      it("creates a new tenant", async () => {
        const response = await fetch(`${baseUrl}/make-tenant/TestTenant`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const tenant = await response.json();

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const tenants = await response.json();

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const fetchedTenant = await response.json();

        expect(response.status).toBe(200);
        expect(fetchedTenant.id).toBe(tenant.id);
        expect(fetchedTenant.name).toBe(tenant.name);
      });

      it("returns 404 for non-existent user", async () => {
        const response = await fetch(`${baseUrl}/send-user-tenant/nonexistent@example.com`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await response.json();

        expect(response.status).toBe(404);
        expect(result.status).toBe("error");
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
    describe("POST /make-user", () => {
      it("creates a new user", async () => {
        const tenant = await createTenant();
        const userName = "Test User";
        const userEmail = "test@example.com";

        const response = await fetch(
          `${baseUrl}/make-user/${userEmail}?name=${userName}&tenantId=${tenant.id}`
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = await response.json();

        expect(response.status).toBe(201);
        expect(user.id).toBeDefined();
        expect(user.email).toBe(userEmail);
        expect(user.name).toBe(userName);
        expect(user.tenantId).toBe(tenant.id);
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
      });
    });

    describe("GET /list-users", () => {
      it("lists all users", async () => {
        const tenant = await createTenant();
        await createUser({ tenantId: tenant.id });

        const response = await fetch(`${baseUrl}/list-users`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const users = await response.json();

        expect(response.status).toBe(200);
        expect(users.length).toBe(1);
      });
    });

    describe("GET /send-user", () => {
      it("gets user by email", async () => {
        const tenant = await createTenant();
        await createUser({ tenantId: tenant.id });

        const response = await fetch(`${baseUrl}/send-user/test@example.com`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = await response.json();

        expect(response.status).toBe(200);
        expect(user.email).toBe("test@example.com");
      });
    });
  });

  describe("GET /list-users/:name", () => {
    it("lists users by tenant name", async () => {
      const tenant = await createTenant();
      await createUser({ tenantId: tenant.id });

      const response = await fetch(`${baseUrl}/list-users/${tenant.name}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const users = await response.json();

      expect(response.status).toBe(200);
      expect(users.length).toBe(1);
      expect(users[0].tenantId).toBe(tenant.id);
    });
  });

  describe("GET /show-user/:id", () => {
    it("gets user by id", async () => {
      const tenant = await createTenant();
      const user = await createUser({ tenantId: tenant.id });

      const response = await fetch(`${baseUrl}/show-user/${user.id}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const fetchedUser = await response.json();

      expect(response.status).toBe(200);
      expect(fetchedUser.id).toBe(user.id);
      expect(fetchedUser.email).toBe(user.email);
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.tenantId).toBe(tenant2.id);
    });
  });

  describe("PUT /update-user/:id", () => {
    it("updates user name", async () => {
      const tenant = await createTenant();
      const user = await createUser({ tenantId: tenant.id });
      const newName = "Updated Name";

      const response = await fetch(`${baseUrl}/update-user/${user.id}?name=${newName}`, {
        method: "PUT",
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const updatedUser = await response.json();

      expect(response.status).toBe(200);
      expect(updatedUser.name).toBe(newName);
      expect(updatedUser.id).toBe(user.id);
    });
  });

  describe("POST /delete-user", () => {
    it("deletes a user by email", async () => {
      const tenant = await createTenant();
      const user = await createUser({ tenantId: tenant.id });

      const response = await fetch(`${baseUrl}/delete-user?email=${user.email}`, {
        method: "POST",
      });

      expect(response.status).toBe(200);
    });
  });
});
