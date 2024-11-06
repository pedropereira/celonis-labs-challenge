const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    await prisma.user.deleteMany()
    await prisma.tenant.deleteMany()
    const demoUser = await prisma.user.create({
        data: {
            name: 'Alice',
            email: 'alice@celonis.cloud',
        }
    })
    const demoTenant = await prisma.tenant.create({
        data: {
            name: "Unitech"
        }
    });
    await prisma.user.update({
        where: { id: demoUser.id },
        data: {
            Tenant: {
                connect: {
                    id: demoTenant.id
                }
            }
        }
    })
}

main()