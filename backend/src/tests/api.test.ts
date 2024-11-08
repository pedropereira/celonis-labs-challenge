import { app } from '../app';
import http from 'http';
import { expect, it, describe, beforeAll, beforeEach, afterAll } from '@jest/globals';
import { prisma } from '../prisma';

describe('API Endpoints', () => {
  let server: http.Server;
  const port = 3001;
  const baseUrl = `http://localhost:${port}`;

  const createTestTenant = async () => {
    const response = await fetch(`${baseUrl}/make-tenant/TestTenant`);
    return response;
  };

  const createTestUser = async () => {
    const response = await fetch(
      `${baseUrl}/make-user/test@example.com?name=Test User&tenantId=1`
    );
    return response;
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
        const response = await createTestTenant();
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
        expect(Array.isArray(tenants)).toBeTruthy();
        expect(tenants.length).toBeGreaterThan(0);
      });
    });
  });

  describe('User Endpoints', () => {
    describe('POST /make-user', () => {
      it('creates a new user', async () => {
        await createTestTenant();

        const response = await createTestUser();
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual({ status: 'success' });
      });
    });

    describe('GET /list-users', () => {
      it('lists all users', async () => {
        await createTestTenant();
        await createTestUser();

        const response = await fetch(`${baseUrl}/list-users`);
        const users = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(users)).toBeTruthy();
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
