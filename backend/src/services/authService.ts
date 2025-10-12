import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppError } from '../errors/AppError.js'
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export const registerService = async (name: string, email: string, password: string) => {
  // ตรวจสอบ email ซ้ำ
  const existing = await prisma.users.findUnique({ where: { email } })
  if (existing) {
    throw new AppError('Email already exists', 409, 'EMAIL_DUPLICATE')
  }

  // เข้ารหัสรหัสผ่าน
  const hashed = await bcrypt.hash(password, 10)

  // สร้าง user
  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'user'
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  })

  return user
}

export const loginService = async (email: string, password: string) => {
  const user = await prisma.users.findUnique({ where: { email } })
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND')

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS')

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  )

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
}