import { Router } from "express"
import { validateBody, validateQuery } from "../validation/validate.js"
import { createUserSchema, updateUserSchema } from "../dtos/user.schema.js"
import { create, index2, remove, show, update } from "../controllers/userController.js"
import { paginationSchema } from "../dtos/pagination.schema.js"
import { authGuard } from "../middlewares/authMiddleware.js"
// import { requireRole } from "../middlewares/roleMiddleware.js"

const userRoutes = Router()

// GET /api/v1/users?limit=10&offset=0
userRoutes.get('/', validateQuery(paginationSchema), index2)

// GET /api/v1/users/:id
userRoutes.get('/:id', authGuard, show)

// POST /api/v1/users
userRoutes.post('/', authGuard, validateBody(createUserSchema), create)

// PUT /api/v1/users/:id
userRoutes.put('/:id', validateBody(updateUserSchema), update)

// DELETE /api/v1/users/:id
userRoutes.delete('/:id', remove)

export default userRoutes
