import { type Request, type Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type Controller } from '@/application/controllers'
import { mock } from 'jest-mock-extended'

describe('', () => {
  it('should call handle with correct request', async () => {
    const req = getMockReq({ body: { any: 'any' } })
    const { res } = getMockRes()
    const controller = mock<Controller>()
    const sut = new ExpressRouter(controller)
    await sut.adapter(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })
})

class ExpressRouter {
  constructor(private readonly controller: Controller) { }
  async adapter(req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body })
  }
}
