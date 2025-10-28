import { prisma } from '../prisma-client'

export async function seedExample() {
  const user = await prisma.user.create({
    data: {
      id: 'user-1',
      name: 'wilson Example',
      email: 'wilson@example.com',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  const cv = await prisma.cv.create({
    data: {
      id: 'cv-1',
      userId: user.id,
      title: 'Software Engineer CV',
    },
  })

  await prisma.section.create({
    data: {
      id: 'sec-1',
      cvId: cv.id,
      type: 'EDUCATION',
      content: {
        school: 'Universitas Padjadjaran',
        major: 'Computer Science',
        start: '2023',
        end: 'Present',
      },
    },
  })
}