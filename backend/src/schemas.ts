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
