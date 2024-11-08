import { Express, Request, Response, NextFunction } from "express";
import { prisma } from "./prisma";
import * as schemas from "./schemas";
import { validateRequest } from "./middleware";

export function setupRoutes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.send("Successful response.");
  });

  app.get(
    "/make-user/:email",
    (req: Request, res: Response, next: NextFunction) => {
      validateRequest(schemas.makeUserSchema)(req, res, next).catch(next);
    },
    async (req: Request, res: Response) => {
      const userData = {
        email: req.params.email,
        name: req.query.name as string,
        tenantId: req.query.tenantId as string,
      };

      try {
        const user = await prisma.user.create({ data: userData });

        res.status(200).json(user);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      }
    }
  );

  app.get("/list-users", async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();

      res.status(200).json(users);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      res.status(400).json({ status: "error", error: errorMessage });
    }
  });

  app.get("/list-users/:name", async (req: Request, res: Response) => {
    await prisma.user
      .findMany({ where: { Tenant: { name: req.params.name } } })
      .then((users) => res.status(200).json(users))
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      });
  });

  app.get("/show-user/:id", async (req: Request, res: Response) => {
    await prisma.user
      .findUnique({ where: { id: req.params.id } })
      .then((user) => res.status(200).json(user))
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      });
  });

  app.get("/send-user/:email", async (req: Request, res: Response) => {
    await prisma.user
      .findUnique({ where: { email: req.params.email } })
      .then((user) => res.status(200).json(user))
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      });
  });

  app.get("/send-user-tenant/:email", async (req: Request, res: Response) => {
    await prisma.user
      .findUnique({ where: { email: req.params.email } })
      .then((user) => {
        if (user?.tenantId) {
          return prisma.tenant
            .findUnique({
              where: { id: user.tenantId },
            })
            .then((tenant) => res.json(tenant));
        } else {
          res.status(404).json({ status: "error", error: "User or tenantId not found" });
        }
      })
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      });
  });

  app.get("/make-tenant/:name", async (req: Request, res: Response) => {
    const tenant = { name: req.params.name };

    await prisma.tenant
      .create({ data: tenant })
      .then(() => res.status(200).json({ status: "success" }));
  });

  app.put(
    "/put-user-to-tenant/:email/:name",
    (req: Request, res: Response, next: NextFunction) => {
      validateRequest(schemas.putUserToTenantSchema)(req, res, next).catch(next);
    },
    async (req: Request, res: Response) => {
      const { email, name } = req.params;

      try {
        const tenant = await prisma.tenant.findFirst({ where: { name } });

        if (!tenant) {
          res.status(404).json({ status: "error", error: "Tenant not found" });
          return;
        }

        await prisma.user.update({
          where: { email },
          data: { Tenant: { connect: { id: tenant.id } } },
        });

        res.status(200).json({ status: "success" });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      }
    }
  );

  app.get("/show-tenants", async (req: Request, res: Response) => {
    await prisma.tenant
      .findMany()
      .then((tenants) => res.status(200).json(tenants))
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      });
  });

  app.put(
    "/update-user/:id",
    (req: Request, res: Response, next: NextFunction) => {
      validateRequest(schemas.updateUserSchema)(req, res, next).catch(next);
    },
    async (req: Request, res: Response) => {
      const userId = req.params.id;
      const userData = {
        name: req.query.name as string,
      };

      try {
        const user = await prisma.user.update({
          where: { id: userId },
          data: userData,
        });

        res.status(200).json(user);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      }
    }
  );

  app.post(
    "/delete-user",
    (req: Request, res: Response, next: NextFunction) => {
      validateRequest(schemas.deleteUserSchema)(req, res, next).catch(next);
    },
    async (req: Request, res: Response) => {
      const userEmail = req.query.email as string;

      try {
        await prisma.user.delete({ where: { email: userEmail } });

        res.status(200).json({ status: "success" });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      }
    }
  );

  app.post(
    "/delete-tenant",
    (req: Request, res: Response, next: NextFunction) => {
      validateRequest(schemas.deleteTenantSchema)(req, res, next).catch(next);
    },
    async (req: Request, res: Response) => {
      const tenantName = req.query.name as string;

      try {
        await prisma.tenant.deleteMany({ where: { name: tenantName } });

        res.status(200).json({ status: "success" });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        res.status(400).json({ status: "error", error: errorMessage });
      }
    }
  );
}
