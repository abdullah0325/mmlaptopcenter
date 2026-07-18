import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();
const products = await p.product.findMany({
  select: { id: true, title: true, status: true, inventory: true },
  orderBy: { createdAt: 'desc' },
  take: 30
});
console.log(JSON.stringify(products, null, 2));
await p.$disconnect();