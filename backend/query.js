import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const link1 = await prisma.link.create({
        data: {
            description: 'Tutorial',
            url: 'www.howtographql.com'
        },
    })
    const link2 = await prisma.link.create({
        data: {
            description: 'Tutorial2',
            url: 'www.howtographql.com'
        },
    })
    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}
main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })