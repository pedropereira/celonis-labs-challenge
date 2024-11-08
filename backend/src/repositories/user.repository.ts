import { User } from "@prisma/client";
import { prisma } from "../prisma";

export class UserRepository {
  async create(data: { email: string; name: string; tenantId: string }): Promise<User> {
    return prisma.user.create({ data });
  }

  async findMany(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findManyByTenantName(tenantName: string): Promise<User[]> {
    return prisma.user.findMany({
      where: { Tenant: { name: tenantName } },
    });
  }

  async find(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateByEmail(email: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { email },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
} 
