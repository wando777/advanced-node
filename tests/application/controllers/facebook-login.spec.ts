import { FacebookLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { Required } from '@/application/validation'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken } from '@/domain/entities'

jest.mock('@/application/validation/composite')

describe('FacebookLoginController', () => {
  let token: string
  let sut: FacebookLoginController
  let facebookAuth: jest.Mock
  beforeAll(() => {
    token = 'any_token'
    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue(new AccessToken('valid_token'))
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new FacebookLoginController(facebookAuth)
  })
  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new Required('any_token', 'token')
    ])
  })
  it('should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth).toHaveBeenCalledWith({ token })
  })
  it('should return 401 if FacebookAuthentication fails', async () => {
    facebookAuth.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })
  it('should return 200 if FacebookAuthentication succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: new AccessToken('valid_token')
    })
  })
})
