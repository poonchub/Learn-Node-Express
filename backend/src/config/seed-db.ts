// run: node --loader ts-node/esm src/config/seed-db.ts

import bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  // === Seed Users ===
  const users = [
    { name: 'Alice', email: 'alice@example.com', password: '123456', role: 'admin' },
    { name: 'Bob', email: 'bob@example.com', password: '123456', role: 'user' },
    { name: 'Charlie', email: 'charlie@example.com', password: '123456', role: 'user' },
  ]

  for (const user of users) {
    const existing = await prisma.users.findUnique({ where: { email: user.email } })
    if (!existing) {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      await prisma.users.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role
        }
      })
      console.log(`Created user: ${user.name}`)
    } else {
      console.log(`User already exists: ${user.email}`)
    }
  }

  // === Seed Products ===
  const products = [
    { title: 'Product A', price: 100 },
    { title: 'Product B', price: 200 },
    { title: 'Product C', price: 150 },
  ]

  for (const product of products) {
    const existing = await prisma.products.findFirst({ where: { title: product.title } })
    if (!existing) {
      await prisma.products.create({ data: product })
      console.log(`Created product: ${product.title}`)
    } else {
      console.log(`Product already exists: ${product.title}`)
    }
  }
}

main()
  .catch(err => console.error(err))
  .finally(async () => {
    await prisma.$disconnect()
    console.log('Seeding finished')
  })