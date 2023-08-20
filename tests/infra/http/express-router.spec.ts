import { type Request, type Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type Controller } from '@/application/controllers'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouter
  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    controller = mock()
    sut = new ExpressRouter(controller)
  })
  it('should call handle with correct request', async () => {
    await sut.adapter(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })
  it('should call handle with empty request', async () => {
    const req = getMockReq()

    await sut.adapter(req, res)

    expect(controller.handle).toHaveBeenCalledWith({})
    expect(controller.handle).toHaveBeenCalledTimes(1)
  })
})

class ExpressRouter {
  constructor(private readonly controller: Controller) { }
  async adapter(req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body })
  }
}
