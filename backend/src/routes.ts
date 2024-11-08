import { Express, Request, Response, NextFunction } from "express";
import { prisma } from "./prisma";
import * as schemas from "./schemas";
import { validateRequest } from "./middleware";
import { ErrorDTO, TenantDTO, UserDTO } from "./dtos";

export function setupRoutes(app: Express) {
  app.get("/", (_request: Request, response: Response) => {
    response.status(200).json({ healthy: true });
  });

  app.get(
    "/make-user/:email",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.makeUserSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<UserDTO | ErrorDTO>) => {
      const userData = {
        email: request.params.email,
        name: request.query.name as string,
        tenantId: request.query.tenantId as string,
      };

      try {
        const user = await prisma.user.create({ data: userData });

        response.status(201).json(user);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.get("/list-users", async (_request: Request, response: Response<UserDTO[] | ErrorDTO>) => {
    try {
      const users = await prisma.user.findMany();

      response.status(200).json(users);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      response
        .status(400)
        .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
    }
  });

  app.get(
    "/list-users/:name",
    async (request: Request, response: Response<UserDTO[] | ErrorDTO>) => {
      try {
        const users = await prisma.user.findMany({
          where: { Tenant: { name: request.params.name } },
        });

        response.status(200).json(users);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.get("/show-user/:id", async (request: Request, response: Response<UserDTO | ErrorDTO>) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: request.params.id } });

      if (user) {
        response.status(200).json(user);
      } else {
        response
          .status(404)
          .json({ error: "Not Found", statusCode: "404", messages: ["User not found"] });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      response
        .status(400)
        .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
    }
  });

  app.get("/send-user/:email", async (request: Request, response: Response<UserDTO | ErrorDTO>) => {
    try {
      const user = await prisma.user.findUnique({ where: { email: request.params.email } });

      if (user) {
        response.status(200).json(user);
      } else {
        response
          .status(404)
          .json({ error: "Not Found", statusCode: "404", messages: ["User not found"] });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      response
        .status(400)
        .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
    }
  });

  app.get(
    "/send-user-tenant/:email",
    async (request: Request, response: Response<TenantDTO | ErrorDTO>) => {
      try {
        const user = await prisma.user.findUnique({ where: { email: request.params.email } });

        if (user?.tenantId) {
          const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });

          if (tenant) {
            response.status(200).json(tenant);
          } else {
            response
              .status(404)
              .json({ error: "Not Found", statusCode: "404", messages: ["Tenant not found"] });
          }
        } else {
          response.status(404).json({
            error: "Not Found",
            statusCode: "404",
            messages: ["Tenant not found"],
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.get(
    "/make-tenant/:name",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.makeTenantSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<TenantDTO | ErrorDTO>) => {
      const tenantData = { name: request.params.name };

      try {
        const tenant = await prisma.tenant.create({ data: tenantData });

        response.status(201).json(tenant);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.put(
    "/put-user-to-tenant/:email/:name",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.putUserToTenantSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<UserDTO | ErrorDTO>) => {
      const { email, name } = request.params;

      try {
        const tenant = await prisma.tenant.findFirst({ where: { name } });

        if (!tenant) {
          response
            .status(404)
            .json({ error: "Not Found", statusCode: "404", messages: ["Tenant not found"] });

          return;
        }

        const updatedUser = await prisma.user.update({
          where: { email },
          data: { tenantId: tenant.id },
        });

        response.status(200).json(updatedUser);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.get(
    "/show-tenants",
    async (_request: Request, response: Response<TenantDTO[] | ErrorDTO>) => {
      try {
        const tenants = await prisma.tenant.findMany();

        response.status(200).json(tenants);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.put(
    "/update-user/:id",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.updateUserSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<UserDTO | ErrorDTO>) => {
      const userId = request.params.id;
      const userData = {
        name: request.query.name as string,
      };

      try {
        const user = await prisma.user.update({
          where: { id: userId },
          data: userData,
        });

        response.status(200).json(user);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.post(
    "/delete-user",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.deleteUserSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<null | ErrorDTO>) => {
      const userEmail = request.query.email as string;

      try {
        await prisma.user.delete({ where: { email: userEmail } });

        response.status(200).end();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.post(
    "/delete-tenant",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.deleteTenantSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<null | ErrorDTO>) => {
      const tenantName = request.query.name as string;

      try {
        await prisma.tenant.deleteMany({ where: { name: tenantName } });

        response.status(200).end();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );
}
