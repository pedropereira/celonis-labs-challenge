import {PrismaClient} from "@prisma/client";

const express = require('express');

var bodyParser = require('body-parser')

const app = express();

app.get('/', (req: any, res: any) => {
    res.send('Successful response.');
});

app.get('/make-user/:email', (req: any, res: any) => {
    var user = {email: req.params.email, name: req.query.name};
    console.log(user);
    var prisma = new PrismaClient();
    prisma.user.create({data: user}).then(() => res.json({status: "success"}))

});

app.get('/list-users', (req: any, res: any) => {
    var prisma = new PrismaClient();
    prisma.user.findMany().then((users) => res.json(users));
});


app.get('/list-users/:name', (req: any, res: any) => {
    var prisma = new PrismaClient();
    prisma.user.findMany({where: {Tenant: {name: req.params.name}}}).then((users) => res.json(users));
});

app.get('/show-user/:id', (req: any, res: any) => {
    var prisma = new PrismaClient();
    prisma.user.findUnique({where: {id: req.params.id}}).then((user) => res.json(user));
});

app.get('/send-user/:email', (req: any, res: any) => {
    var prisma = new PrismaClient();
    prisma.user.findUnique({where: {email: req.params.email}}).then((user) => res.json(user));
});

app.get('/send-user-tenant/:email', (req: any, res: any) => {
    var prisma = new PrismaClient();
    prisma.user.findUnique({where: {email: req.params.email}}).then((user) => prisma.tenant.findUnique({
        where: {id: user.tenantId}
    }).then((tenant) => res.json(tenant)).catch((err) => res.json({status: "error", error: err})));
});

app.get('/make-tenant/:name', (req: any, res: any) => {
    var tenant = {name: req.params.name};
    console.log(tenant);
    var prisma = new PrismaClient();
    prisma.tenant.create({data: tenant}).then(() => res.json({status: "success"}))
});

app.put('/put-user-to-tenant/:email/:name', async (req: any, res: any) => {
    var prisma = new PrismaClient();
    const tenant = await prisma.tenant.findFirst({where: {name: req.params.name}});
    prisma.user.update({
        where: {email: req.params.email},
        // @ts-ignore
        data: {Tenant: {connect: {id: tenant.id}}}
    }).then(() => res.json({status: "success"}))
});

app.get('/show-tenants', (req: any, res: any) => {
    var prisma = new PrismaClient();
    prisma.tenant.findMany().then((tenants) => res.json(tenants));
});

app.put('/update-user/:id', (req: any, res: any) => {
    var prisma = new PrismaClient();
    prisma.user.update({where: {id: req.params.id}, data: {name: req.query.name}}).then(() => res.json({status: "success"}))
});

app.post('/delete-user',(req: any, res: any) => {
    var prisma = new PrismaClient();
    prisma.user.delete({where: {email: req.query.email}}).then(() => res.json({status: "success"}))
});

app.post('/delete-tenant',(req: any, res: any) => {
    var prisma = new PrismaClient();
    prisma.tenant.deleteMany({where: {name: req.query.name}}).then(() => res.json({status: "success"}))
});


app.listen(3000, () => console.log('Example app is listening on port 3000.'));
