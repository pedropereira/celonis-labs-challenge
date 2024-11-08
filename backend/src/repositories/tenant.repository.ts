import { Tenant } from "@prisma/client";
import { prisma } from "../prisma";

export class TenantRepository {
  async create(data: { name: string }): Promise<Tenant> {
    return prisma.tenant.create({ data });
  }

  async findMany(): Promise<Tenant[]> {
    return prisma.tenant.findMany();
  }

  async findById(id: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Tenant | null> {
    return prisma.tenant.findFirst({ where: { name } });
  }

  async deleteByName(name: string): Promise<boolean> {
    await prisma.tenant.deleteMany({ where: { name } });

    return true;
  }
}
