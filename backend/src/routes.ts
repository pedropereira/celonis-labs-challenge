import { Express, Request, Response, NextFunction } from 'express';
import { prisma } from './prisma';
import * as schemas from './schemas';
import { validateRequest } from './middleware';

export function setupRoutes(app: Express) {
  app.get('/', (req: Request, res: Response) => {
    res.send('Successful response.');
});

app.get('/make-user/:email',
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(schemas.makeUserSchema)(req, res, next).catch(next);
  },
  async (req: Request, res: Response) => {
    const userData = {
      email: req.params.email,
      name: req.query.name as string,
      tenantId: req.query.tenantId as string
    };

    try {
      const user = await prisma.user.create({ data: userData});

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({status: "error", error: error.message});
    }
  });

app.get('/list-users', (req: Request, res: Response) => {
  prisma.user.findMany().then((users) => res.json(users));
});

app.get('/list-users/:name', (req: Request, res: Response) => {
  prisma.user.findMany({where: {Tenant: {name: req.params.name}}}).then((users) => res.json(users));
});

app.get('/show-user/:id', (req: Request, res: Response) => {
  prisma.user.findUnique({where: {id: req.params.id}}).then((user) => res.json(user));
});

app.get('/send-user/:email', (req: Request, res: Response) => {
  prisma.user.findUnique({where: {email: req.params.email}}).then((user) => res.json(user));
});

app.get('/send-user-tenant/:email', (req: Request, res: Response) => {
  prisma.user.findUnique({where: {email: req.params.email}}).then((user) => {
    if (user && user.tenantId) {
        return prisma.tenant.findUnique({
            where: {id: user.tenantId}
        }).then((tenant) => res.json(tenant));
    } else {
        res.json({status: "error", error: "User or tenantId not found"});
    }
  }).catch((err) => res.json({status: "error", error: err}));
});

app.get('/make-tenant/:name', (req: Request, res: Response) => {
  var tenant = {name: req.params.name};

  prisma.tenant.create({data: tenant}).then(() => res.json({status: "success"}))
});

app.put('/put-user-to-tenant/:email/:name',
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
        data: { Tenant: { connect: { id: tenant.id } } }
      });

      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  });

app.get('/show-tenants', (req: Request, res: Response) => {
  prisma.tenant.findMany().then((tenants) => res.json(tenants));
});

app.put('/update-user/:id',
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(schemas.updateUserSchema)(req, res, next).catch(next);
  },
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const userData = {
      name: req.query.name as string
    };

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: userData
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  });

app.post('/delete-user',
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(schemas.deleteUserSchema)(req, res, next).catch(next);
  },
  async (req: Request, res: Response) => {
    const userEmail = req.query.email as string;

    try {
      await prisma.user.delete({ where: { email: userEmail } });

      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  });

app.post('/delete-tenant',
  (req: Request, res: Response, next: NextFunction) => {
    validateRequest(schemas.deleteTenantSchema)(req, res, next).catch(next);
  },
  async (req: Request, res: Response) => {
    const tenantName = req.query.name as string;

    try {
      await prisma.tenant.deleteMany({ where: { name: tenantName } });

      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  });
}
