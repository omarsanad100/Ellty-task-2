import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './auth/auth.routes.js'
import postRoutes from './post/post.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'

const app = express()

app.use(cors())
app.use(express.json())

const routes = express.Router()
routes.use(authRoutes)
routes.use(postRoutes)
app.use('/', routes)

app.use(errorMiddleware)

export default app
