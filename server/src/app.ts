import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import testRoutes from './routes/auth.routes.js'
import { connectDB, disconnectDB } from './config/db.js'

dotenv.config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Test route
app.use('/api', testRoutes)

export default app
