import { app } from '../app';
import http from 'http';
import { expect, it, describe, beforeAll, beforeEach, afterAll } from '@jest/globals';
import { prisma } from '../prisma';

describe('API Endpoints', () => {
  let server: http.Server;
  const port = 3001;
  const baseUrl = `http://localhost:${port}`;

  const createTestTenant = async () => {
    const tenant = await prisma.tenant.create({
      data: {
        id: '00c0e1b4-2140-42ea-b82e-0970428352f1',
        name: 'TestTenant',
      },
    });

    return tenant;
  };

  const createTestUser = async (tenantId?: string) => {
    const user = await prisma.user.create({
      data: {
        id: '270c8d1e-3dc5-44d2-8e59-ccb9c2722e95',
        email: 'test@example.com',
        name: 'Test User',
        tenantId: tenantId || '00c0e1b4-2140-42ea-b82e-0970428352f1'
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
          console.error('Error closing the server:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  // Tenant endpoint tests
  describe('Tenant Endpoints', () => {
    describe('POST /make-tenant', () => {
      it('creates a new tenant', async () => {
        const response = await fetch(`${baseUrl}/make-tenant/TestTenant`);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.status).toBe('success');
      });
    });

    describe('GET /show-tenants', () => {
      it('lists all tenants', async () => {
        await createTestTenant();

        const response = await fetch(`${baseUrl}/show-tenants`);
        const tenants = await response.json();

        expect(response.status).toBe(200);
        expect(tenants.length).toBe(1);
      });
    });
  });

  describe('User Endpoints', () => {
    describe('POST /make-user', () => {
      it('creates a new user', async () => {
        const tenant = await createTestTenant();
        const userName = 'Test User';
        const userEmail = 'test@example.com';

        const response = await fetch(
          `${baseUrl}/make-user/${userEmail}?name=${userName}&tenantId=${tenant.id}`
        );
        const user = await response.json();

        expect(response.status).toBe(200);
        expect(user.id).toBeDefined();
        expect(user.email).toBe(userEmail);
        expect(user.name).toBe(userName);
        expect(user.tenantId).toBe(tenant.id);
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
      });
    });

    describe('GET /list-users', () => {
      it('lists all users', async () => {
        await createTestTenant();
        await createTestUser();

        const response = await fetch(`${baseUrl}/list-users`);
        const users = await response.json();

        expect(response.status).toBe(200);
        expect(users.length).toBe(1);
      });
    });

    describe('GET /send-user', () => {
      it('gets user by email', async () => {
        await createTestTenant();
        await createTestUser();

        const response = await fetch(`${baseUrl}/send-user/test@example.com`);
        const user = await response.json();

        expect(response.status).toBe(200);
        expect(user.email).toBe('test@example.com');
      });
    });
  });
});
