import { type Controller } from '@/application/controllers'
import { type Request, type Response } from 'express'

export class ExpressRouter {
  constructor(private readonly controller: Controller) { }
  async adapter(req: Request, res: Response): Promise<void> {
    const response = await this.controller.handle({ ...req.body })
    if (response.statusCode === 200) {
      res.status(200).json(response.data)
    } else {
      res.status(response.statusCode).json({ error: response.data.message })
    }
  }
}
