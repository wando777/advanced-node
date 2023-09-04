/* eslint-disable @typescript-eslint/await-thenable,  @typescript-eslint/no-confusing-void-expression */
import { type Middleware } from '@/application/middlewares'
import { adaptExpressMiddleware } from '@/main/adapters'
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
      statusCode: 200,
      data: {
        emptyProp: '',
        nullProp: null,
        undefiniedProp: undefined,
        prop: 'any_value'
      }
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
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    })

    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })
  it('should add valid data to req.locals', async () => {
    await sut(req, res, next)

    expect(req.locals).toEqual({ prop: 'any_value' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
