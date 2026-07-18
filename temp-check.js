const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.product.findUnique({
  where: { id: 'cmnrc3lfg0013ti0knsf599g8-simple' },
  select: { id: true, title: true, status: true, inventory: true, availableForSale: true }
}).then(console.log).finally(() => p.$disconnect());