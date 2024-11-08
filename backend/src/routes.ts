import { Express, Request, Response, NextFunction } from "express";
import * as schemas from "./schemas";
import { validateRequest } from "./middleware";
import { ErrorDTO, TenantDTO, UserDTO } from "./dtos";
import { UserRepository } from "./repositories/user.repository";
import { TenantRepository } from "./repositories/tenant.repository";

export function setupRoutes(app: Express) {
  const userRepository = new UserRepository();
  const tenantRepository = new TenantRepository();

  app.get("/", (_request: Request, response: Response) => {
    response.status(200).json({ healthy: true });
  });

  app.post(
    "/v1/users",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.createUserSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<UserDTO | ErrorDTO>) => {
      const userData = {
        email: request.body.email as string,
        name: request.body.name as string,
        tenantId: request.body.tenantId as string,
      };

      try {
        const user = await userRepository.create(userData);

        response.status(201).json(user);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.get("/v1/users", async (_request: Request, response: Response<UserDTO[] | ErrorDTO>) => {
    try {
      const users = await userRepository.findMany();

      response.status(200).json(users);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      response
        .status(400)
        .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
    }
  });

  app.get("/v1/users/:id", async (request: Request, response: Response<UserDTO | ErrorDTO>) => {
    try {
      const user = await userRepository.find(request.params.id);

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

  app.patch(
    "/v1/users/:id",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.updateUserSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<UserDTO | ErrorDTO>) => {
      const userId = request.params.id;
      const userData = {
        name: request.body.name as string,
      };

      try {
        const user = await userRepository.update(userId, userData);

        response.status(200).json(user);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.delete(
    "/v1/users/:id",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.deleteUserSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<null | ErrorDTO>) => {
      const id = request.params.id;

      try {
        await userRepository.delete(id);

        response.status(200).end();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.get(
    "/send-user-tenant/:email",
    async (request: Request, response: Response<TenantDTO | ErrorDTO>) => {
      try {
        const user = await userRepository.findByEmail(request.params.email);
        if (user?.tenantId) {
          const tenant = await tenantRepository.findById(user.tenantId);
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
        const tenant = await tenantRepository.create(tenantData);

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
        const tenant = await tenantRepository.findByName(name);

        if (!tenant) {
          response
            .status(404)
            .json({ error: "Not Found", statusCode: "404", messages: ["Tenant not found"] });

          return;
        }

        const updatedUser = await userRepository.updateByEmail(email, { tenantId: tenant.id });

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
        const tenants = await tenantRepository.findMany();

        response.status(200).json(tenants);
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
        await tenantRepository.deleteByName(tenantName);

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
