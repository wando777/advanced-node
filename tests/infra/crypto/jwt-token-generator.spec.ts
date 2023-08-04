import { type TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let jwtParams: any
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeAll(() => {
    jwtParams = { key: 'any_key', secret: 'any_secret' }
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator(jwtParams.secret)
  })

  it('Should call sign with correct params', async () => {
    await sut.generateToken({ key: jwtParams.key, expirationInMs: 3000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: jwtParams.key }, 'any_secret', { expiresIn: 3 })
  })
})

class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly jwtSecret: string) { }
  async generateToken(input: TokenGenerator.Input): Promise<TokenGenerator.Token> {
    const expirationInSeconds = input.expirationInMs / 1000
    jwt.sign({ key: input.key }, this.jwtSecret, { expiresIn: expirationInSeconds })
    return await new Promise((resolve) => { resolve({ value: '' }) })
  }
}
