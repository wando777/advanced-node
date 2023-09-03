/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/await-thenable,  @typescript-eslint/no-confusing-void-expression */

import { type HttpResponse } from '@/application/helpers'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('Express middleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: RequestHandler

  beforeAll(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock<Middleware>()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = adaptExpressMiddleware(middleware)
    middleware.handle.mockResolvedValue({
      statusCode: 500,
      data: { error: 'any_error' }
    })
  })

  it('should call handle with correct request', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
  it('should call handle with empty request', async () => {
    req = getMockReq()

    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({})
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
  it('should respond with correct error and statusCode', async () => {
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = (middleware) => {
  return async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers })
    res.status(statusCode).json(data)
  }
}

interface Middleware {
  handle: (HttpRequest: any) => Promise<HttpResponse>
}
