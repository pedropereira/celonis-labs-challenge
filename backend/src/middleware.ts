import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body as Record<string, unknown>,
        query: req.query as Record<string, unknown>,
        params: req.params as Record<string, unknown>,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
