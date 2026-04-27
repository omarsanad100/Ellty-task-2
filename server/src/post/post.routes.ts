// modules/post/post.routes.ts
import { Router } from 'express'
import * as controller from './post.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', controller.getTree)
router.post('/root', authMiddleware, controller.createRoot)
router.post('/operation', authMiddleware, controller.addOperation)

export default router
