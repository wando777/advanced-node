/* eslint-disable @typescript-eslint/no-misused-promises */

import { type HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import { mock } from 'jest-mock-extended'

describe('Express middleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  it('should call handle with correct request', async () => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    const middleware = mock<Middleware>()
    const sut = adaptExpressMiddleware(middleware)

    sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
  it('should call handle with empty request', async () => {
    req = getMockReq()
    res = getMockRes().res
    next = getMockRes().next
    const middleware = mock<Middleware>()
    const sut = adaptExpressMiddleware(middleware)

    sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    await middleware.handle({ ...req.headers })
  }
}

interface Middleware {
  handle: (HttpRequest: any) => Promise<HttpResponse>
}
