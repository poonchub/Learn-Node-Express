
import type { CreateUserSchema, UpdateUserSchema } from '../dtos/user.schema.js'
import { AppError } from '../errors/AppError.js'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

// 🟢 CREATE user
export const createUser = async (data: CreateUserSchema) => {
  const { name, email, password } = data

  // ตรวจสอบอีเมลซ้ำ
  const existing = await prisma.users.findUnique({ where: { email } })
  if (existing) {
    throw new AppError('Email already exists', 409, 'EMAIL_DUPLICATE')
  }

  // เข้ารหัสรหัสผ่าน
  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.users.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  return user
}

// 🟢 READ (get all users)
export const getUsers = async () => {
  return prisma.users.findMany({
    orderBy: { id: 'asc' },
    select: { id: true, name: true, email: true, createdAt: true },
  })
}

// 🟢 READ (get by id)
export const getUserById = async (id: number) => {
  const user = await prisma.users.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND')

  return user
}

// 🟢 UPDATE
export const updateUser = async (id: number, data: UpdateUserSchema) => {
  const { name, email } = data

  const updateData: any = {
    updatedAt: new Date(),
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
  }

  const updated = await prisma.users.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, updatedAt: true },
  }).catch(() => {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  })

  return updated
}

// 🟢 DELETE
export const deleteUser = async (id: number) => {
  try {
    await prisma.users.delete({ where: { id } })
    return true
  } catch {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }
}

// 🟢 PAGINATION
export const getUsersPaginated = async (limit = 10, offset = 0) => {
  const [data, total] = await Promise.all([
    prisma.users.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: 'asc' },
      select: { id: true, name: true, email: true },
    }),
    prisma.users.count(),
  ])

  return { data, total }
}