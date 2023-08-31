import { ForbiddenError } from '@/application/errors'
import { type HttpResponse, forbidden } from './../../../src/application/helpers/https'
import { type Authorize } from '@/domain/use-cases'
describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorize: jest.Mock
  let authorization: string

  beforeAll(() => {
    authorization = 'any_authorization_token'
    authorize = jest.fn()
    authorize.mockResolvedValue('any_key')
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
})

type HttpRequest = {
  authorization: string
}

export class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {
  }

  async handle({ authorization }: HttpRequest): Promise<HttpResponse> {
    await this.authorize({ token: authorization })
    return forbidden()
  }
}
