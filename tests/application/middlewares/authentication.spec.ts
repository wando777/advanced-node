import { ForbiddenError } from '@/application/errors'
import { type HttpResponse, forbidden, ok } from './../../../src/application/helpers/https'
import { type Authorize } from '@/domain/use-cases'
import { Required } from '@/application/validation'
describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorize: jest.Mock
  let authorization: string

  beforeAll(() => {
    authorization = 'any_authorization_token'
    authorize = jest.fn()
    authorize.mockResolvedValue('any_userId')
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new AuthenticationMiddleware(authorize)
  })
  it('should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({ statusCode: 403, data: new ForbiddenError() })
  })
  it('should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({ statusCode: 403, data: new ForbiddenError() })
  })
  it('should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({ statusCode: 403, data: new ForbiddenError() })
  })
  it('should call authorize with correct inputs', async () => {
    await sut.handle({ authorization })

    expect(authorize).toHaveBeenCalledWith({ token: authorization })
    expect(authorize).toHaveBeenCalledTimes(1)
  })
  it('should return 403 if authorize throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'))

    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({ statusCode: 403, data: new ForbiddenError() })
  })
  it('should return 200 with userId on success', async () => {
    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({ statusCode: 200, data: { userId: 'any_userId' } })
  })
})

type HttpRequest = {
  authorization: string
}

type Model = Error | { userId: string }

export class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {
  }

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    const isError = this.validate({ authorization })
    if (isError) {
      return forbidden()
    }
    try {
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate({ authorization }: HttpRequest): boolean {
    const error = new Required(authorization, 'authorization').validate()
    return !(error === undefined)
  }
}
