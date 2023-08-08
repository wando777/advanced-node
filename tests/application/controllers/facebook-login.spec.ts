import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { mock, type MockProxy } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>
  beforeAll(() => {
    facebookAuth = mock()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new FacebookLoginController(facebookAuth)
  })
  it('should return 400 if token is empty', async () => {
    const res = await sut.handle({ token: '' })
    expect(res).toEqual({
      statusCode: 400,
      data: new Error('A valid token must be provided')
    })
  })
  it('should return 400 if token is undefined', async () => {
    const res = await sut.handle({ token: undefined })
    expect(res).toEqual({
      statusCode: 400,
      data: new Error('A valid token must be provided')
    })
  })
  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
  })
  it('should returns 401 if FacebookAuthentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })
})

class FacebookLoginController implements Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) { }
  async handle(httpRequest: any): Promise<HttpResponse> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!httpRequest?.token || Object.keys(httpRequest.token).length === 0) {
      return {
        statusCode: 400,
        data: new Error('A valid token must be provided')
      }
    }

    const res = await this.facebookAuth.perform({ token: httpRequest.token })

    return {
      statusCode: 401,
      data: res
    }
  }
}

type HttpResponse = {
  statusCode: number
  data: any
}

interface Controller {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
