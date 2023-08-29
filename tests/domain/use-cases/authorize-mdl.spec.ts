import { type TokenValidator } from '@/domain/contracts/crypto'
import { type Authorize, setupAuthorize } from '@/domain/use-cases'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/facebook-account-model')

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_id')
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = setupAuthorize(crypto)
  })

  it('Should call TokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
  it('Should return the correct accessToken', async () => {
    const userId = await sut({ token })

    expect(userId).toBe('any_id')
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})
