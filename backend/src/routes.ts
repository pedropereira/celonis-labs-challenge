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

  app.post(
    "/v1/tenants",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.createTenantSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<TenantDTO | ErrorDTO>) => {
      const tenantData = { name: request.body.name as string };

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

  app.get("/v1/tenants", async (_request: Request, response: Response<TenantDTO[] | ErrorDTO>) => {
    try {
      const tenants = await tenantRepository.findMany();

      response.status(200).json(tenants);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      response
        .status(400)
        .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
    }
  });

  app.get("/v1/tenants/:id", async (request: Request, response: Response<TenantDTO | ErrorDTO>) => {
    try {
      const tenant = await tenantRepository.find(request.params.id);

      if (tenant) {
        response.status(200).json(tenant);
      } else {
        response
          .status(404)
          .json({ error: "Not Found", statusCode: "404", messages: ["Tenant not found"] });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      response
        .status(400)
        .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
    }
  });

  app.patch(
    "/v1/tenants/:id",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.updateTenantSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<TenantDTO | ErrorDTO>) => {
      const tenantId = request.params.id;
      const tenantData = { name: request.body.name as string };

      try {
        const tenant = await tenantRepository.update(tenantId, tenantData);

        response.status(200).json(tenant);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        response
          .status(400)
          .json({ error: "Bad Request", statusCode: "400", messages: [errorMessage] });
      }
    }
  );

  app.delete(
    "/v1/tenants/:id",
    (request: Request, response: Response, next: NextFunction) => {
      validateRequest(schemas.deleteTenantSchema)(request, response, next).catch(next);
    },
    async (request: Request, response: Response<null | ErrorDTO>) => {
      const tenantId = request.params.id;

      try {
        await tenantRepository.delete(tenantId);

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
