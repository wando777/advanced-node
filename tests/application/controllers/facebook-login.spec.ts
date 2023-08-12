import { FacebookLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { Required } from '@/application/validation'
import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/application/validation/composite')

describe('FacebookLoginController', () => {
  let token: string
  let sut: FacebookLoginController
  let facebookAuth: MockProxy<FacebookAuthentication>
  beforeAll(() => {
    token = 'any_token'
    facebookAuth = mock()
    facebookAuth.perform.mockResolvedValue(new AccessToken('valid_token'))
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

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token })
  })
  it('should return 401 if FacebookAuthentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())

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
