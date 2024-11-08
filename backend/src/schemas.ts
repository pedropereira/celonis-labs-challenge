import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    tenantId: z.string().uuid(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const makeTenantSchema = z.object({
  params: z.object({
    name: z.string().min(1),
  }),
});

export const deleteTenantSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const putUserToTenantSchema = z.object({
  params: z.object({
    email: z.string().email(),
  }),
});
