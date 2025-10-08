// run: node --loader ts-node/esm src/server/02_server.ts
import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import userRoutes from '../routes/userRoutes.js'
import { errorHandler } from '../middlewares/errorHandler.js'

dotenv.config()

const app = express()

// Middleware สำหรับ parsing JSON
app.use(express.json())

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' })
})

// User routes
app.use('/api/v1/users', userRoutes)

// Centralized error handling
app.use(errorHandler)

// 404 Not Found handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: { message: 'Route not found' } })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})