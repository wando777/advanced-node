import { FacebookLoginController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { Required } from '@/application/validation'
import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'

import { mock, type MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'

jest.mock('@/application/validation/required')

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
  it('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const RequiredSpy = jest
      .fn()
      .mockImplementationOnce(() => ({
        validate: jest.fn().mockReturnValueOnce(error)
      }))
    mocked(Required).mockImplementationOnce(RequiredSpy)
    const res = await sut.handle({ token })
    expect(Required).toHaveBeenCalledWith('any_token', 'token')
    expect(res).toEqual({
      statusCode: 400,
      data: error
    })
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
  it('should return 500 if FacebookAuthentication throws', async () => {
    const genericError = new Error('infra_error')
    facebookAuth.perform.mockRejectedValueOnce(new ServerError(genericError))

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(genericError)
    })
  })
})
