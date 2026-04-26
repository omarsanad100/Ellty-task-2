import { Router } from 'express'
import { testController } from './../controllers/auth.controller.js'

const router = Router()

router.get('/login', testController)

export default router
