import { z } from "zod";

export const makeUserSchema = z.object({
  params: z.object({
    email: z.string().email(),
  }),
  query: z.object({
    name: z.string().min(1),
    tenantId: z.string().uuid(),
  }),
});

export const updateUserSchema = z.object({
  query: z.object({
    name: z.string().min(1),
  }),
});

export const deleteUserSchema = z.object({
  query: z.object({
    email: z.string().email(),
  }),
});

export const deleteTenantSchema = z.object({
  query: z.object({
    name: z.string().min(1),
  }),
});

export const putUserToTenantSchema = z.object({
  params: z.object({
    email: z.string().email(),
    name: z.string().min(1),
  }),
});