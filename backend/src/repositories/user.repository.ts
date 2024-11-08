import { User } from "@prisma/client";
import { prisma } from "../prisma";

export class UserRepository {
  async create(data: { email: string; name: string; tenantId: string }): Promise<User> {
    return prisma.user.create({ data });
  }

  async findMany(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async find(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.user.delete({ where: { id } });

    return true;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
