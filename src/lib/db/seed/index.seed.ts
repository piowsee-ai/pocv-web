import { prisma } from '../prisma-client'
import { seedExample } from './example.seed'

async function main() {
  await seedExample()
}

main().then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
