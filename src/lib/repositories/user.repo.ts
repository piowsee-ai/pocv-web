import { prisma } from '../db/prisma-client'
import type { User } from '@/generated/prisma'

export const UserRepository = {
    async findAll(): Promise<User[]> {
        return prisma.user.findMany();
    }
};