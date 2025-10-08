import type { Request, Response, NextFunction } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, getUsersPaginated } from "../services/userService.js";
import type { CreateUserSchema, UpdateUserSchema } from "../dtos/user.schema.js";

export const create = async (req: Request<{}, {}, CreateUserSchema>, res: Response, next: NextFunction) => {
  try {
    const user = await createUser(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getUsers()
    res.status(200).json({ success: true, data: users })
  } catch (err) {
    next(err)
  }
}

export const index2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // query params มาเป็น string → แปลงเป็น number
    const limit = Number(req.query.limit) || 10
    const offset = Number(req.query.offset) || 0

    const { data, total } = await getUsersPaginated(limit, offset)

    res.json({
      success: true,
      data,
      meta: { total, limit, offset }
    })
  } catch (err) {
    next(err)
  }
}

export const show = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(Number(req.params.id))
    res.status(200).json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request<{ id: string }, {}, UpdateUserSchema>, res: Response, next: NextFunction) => {
  try {
    const updated = await updateUser(Number(req.params.id), req.body)
    res.status(200).json({ success: true, data: updated })
  } catch (err) {
    next(err)
  }
}

export const remove = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await deleteUser(Number(req.params.id))
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}