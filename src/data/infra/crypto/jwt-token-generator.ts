import { type TokenGenerator } from '@/data/contracts/crypto'
import { sign } from 'jsonwebtoken'

export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly jwtSecret: string) { }
  async generateToken(input: TokenGenerator.Input): Promise<TokenGenerator.Token> {
    const expirationInSeconds = input.expirationInMs / 1000
    const token = sign({ key: input.key }, this.jwtSecret, { expiresIn: expirationInSeconds })
    return { value: token }
  }
}
