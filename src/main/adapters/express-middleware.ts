/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Middleware } from '@/application/middlewares'
import { type RequestHandler } from 'express'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers })
    if (statusCode === 200) {
      const entries = Object.entries(data).filter(entry => entry[1])
      req.locals = { ...req.locals, ...Object.fromEntries(entries) }
      next()
    } else {
      res.status(statusCode).json({ error: data.message })
    }
  }
}
