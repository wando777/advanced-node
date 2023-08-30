import { type TokenValidator, type TokenGenerator } from '@/domain/contracts/crypto'
import { sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator {
  constructor(private readonly jwtSecret: string) { }
  async generateToken(
    input: TokenGenerator.Input
  ): Promise<TokenGenerator.Output> {
    const expirationInSeconds = input.expirationInMs / 1000
    const token = sign({ key: input.key }, this.jwtSecret, {
      expiresIn: expirationInSeconds
    })
    return { value: token }
  }

  async validateToken(
    { token }: TokenValidator.Params
  ): Promise<void> {
    verify(token, this.jwtSecret)
  }
}
