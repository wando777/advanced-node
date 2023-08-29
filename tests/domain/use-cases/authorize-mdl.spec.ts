import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/facebook-account-model')

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
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
})

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<void>
}

export namespace TokenValidator {
  export type Params = {
    token: string
  }
}

type Input = { token: string }
type Setup = (crypto: TokenValidator) => Authorize
type Authorize = (params: Input) => Promise<void>

const setupAuthorize: Setup = (crypto) => {
  return async (params) => {
    await crypto.validateToken(params)
  }
}
