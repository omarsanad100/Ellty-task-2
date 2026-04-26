import type { Request, Response } from 'express'

export const testController = async (req: Request, res: Response) => {
  return res.json({ message: 'User successfully logged in' })
}
