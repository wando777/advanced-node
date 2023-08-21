/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Controller } from '@/application/controllers'
import { type RequestHandler } from 'express'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const { statusCode, data } = await controller.handle({ ...req.body })
    const jsonBody = statusCode === 200 ? data : { error: data.message }
    res.status(statusCode).json(jsonBody)
  }
}

// export class ExpressRouter {
//   constructor(private readonly controller: Controller) { }
//   async adapter(req: Request, res: Response): Promise<void> {
//     const response = await this.controller.handle({ ...req.body })
//     if (response.statusCode === 200) {
//       res.status(200).json(response.data)
//     } else {
//       res.status(response.statusCode).json({ error: response.data.message })
//     }
//   }
// }
