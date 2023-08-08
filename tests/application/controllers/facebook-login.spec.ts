import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, type MockProxy } from 'jest-mock-extended'

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>
  beforeAll(() => {
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue(new AccessToken('valid_token'))
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
  it('should return 401 if FacebookAuthentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })
  it('should return 200 if FacebookAuthentication succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: new AccessToken('valid_token')
    })
  })
  it('should return 500 if FacebookAuthentication throws', async () => {
    const genericError = new Error('infra_error')
    facebookAuth.perform.mockRejectedValueOnce(new ServerError(genericError))

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(genericError)
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
    try {
      const res = await this.facebookAuth.perform({ token: httpRequest.token })
      if (res instanceof AuthenticationError) {
        return {
          statusCode: 401,
          data: res
        }
      }
      return {
        statusCode: 200,
        data: res
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: error
      }
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

class ServerError extends Error {
  constructor(error?: Error) {
    super('The server has been returned an error')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
