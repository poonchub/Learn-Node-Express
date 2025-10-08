import type { CreateUserSchema, UpdateUserSchema } from '../dtos/user.schema.js'
import { AppError } from '../errors/AppError.js'
import { pool } from './db.js'
import bcrypt from 'bcrypt';

// 🟢 CREATE user
export const createUser = async (data: CreateUserSchema) => {
  const { name, email, password } = data

  // ตรวจสอบอีเมลซ้ำ
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rows.length > 0) {
    throw new AppError('Email already exists', 409, 'EMAIL_DUPLICATE')
  }

  // เข้ารหัสรหัสผ่าน
  const hashed = await bcrypt.hash(password, 10)

  const result = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, hashed]
  )

  return result.rows[0]
}

// 🟢 READ (get all users)
export const getUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, created_at FROM users ORDER BY id ASC`
  )
  return result.rows
}

// 🟢 READ (get by id)
export const getUserById = async (id: number) => {
  const result = await pool.query(
    `SELECT id, name, email, created_at FROM users WHERE id = $1`,
    [id]
  )
  if (result.rowCount === 0) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }
  return result.rows[0]
}

// 🟢 UPDATE
export const updateUser = async (id: number, data: UpdateUserSchema) => {
  const { name, email } = data
  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         email = COALESCE($2, email),
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, name, email, updated_at`,
    [name ?? null, email ?? null, id]
  )

  if (result.rowCount === 0) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }

  return result.rows[0]
}

// 🟢 DELETE
export const deleteUser = async (id: number) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id])
  if (result.rowCount === 0) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND')
  }
  return true
}

export const getUsersPaginated = async (limit = 10, offset = 0) => {
  // ดึงข้อมูล users
  const result = await pool.query(
    `SELECT id, name, email
     FROM users
     ORDER BY id ASC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  )

  // ดึง total count สำหรับ metadata
  const countResult = await pool.query('SELECT COUNT(*) FROM users')
  const total = Number(countResult.rows[0].count)

  return { data: result.rows, total }
}