import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from "@prisma/client";
import { validateRequest } from './middleware';
import * as schemas from './schemas';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req: any, res: any) => {
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
    console.log(tenant);
    prisma.tenant.create({data: tenant}).then(() => res.json({status: "success"}))
});

app.put('/put-user-to-tenant/:email/:name', async (req: any, res: any) => {
    const tenant = await prisma.tenant.findFirst({where: {name: req.params.name}});
    prisma.user.update({
        where: {email: req.params.email},
        // @ts-ignore
        data: {Tenant: {connect: {id: tenant.id}}}
    }).then(() => res.json({status: "success"}))
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

app.post('/delete-user',(req: any, res: any) => {
    prisma.user.delete({where: {email: req.query.email}}).then(() => res.json({status: "success"}))
});

app.post('/delete-tenant',(req: any, res: any) => {
    prisma.tenant.deleteMany({where: {name: req.query.name}}).then(() => res.json({status: "success"}))
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
