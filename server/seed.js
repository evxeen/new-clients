const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    const data = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));

    for (const client of data) {
        await prisma.client.create({
            data: client
        });
    }

    console.log('Клиенты успешно загружены!');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
