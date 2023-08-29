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

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<TokenValidator.Result>
}

export namespace TokenValidator {
  export type Params = {
    token: string
  }
  export type Result = string
}

type Input = { token: string }
type Output = string
type Setup = (crypto: TokenValidator) => Authorize
type Authorize = (params: Input) => Promise<Output>

const setupAuthorize: Setup = (crypto) => {
  return async (params) => {
    const userId = await crypto.validateToken(params)
    return userId
  }
}
