import { Tenant } from "@prisma/client";
import { prisma } from "../prisma";

export class TenantRepository {
  async create(data: { name: string }): Promise<Tenant> {
    return prisma.tenant.create({ data });
  }

  async findMany(): Promise<Tenant[]> {
    return prisma.tenant.findMany();
  }

  async find(id: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.tenant.delete({ where: { id } });

    return true;
  }

  async update(id: string, data: { name: string }): Promise<Tenant> {
    return prisma.tenant.update({ where: { id }, data });
  }
}
