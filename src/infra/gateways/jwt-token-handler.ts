import { type TokenValidator, type TokenGenerator } from '@/domain/contracts/gateways'
import { type JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor(private readonly jwtSecret: string) { }
  async generate(
    input: TokenGenerator.Input
  ): Promise<TokenGenerator.Output> {
    const expirationInSeconds = input.expirationInMs / 1000
    const token = sign({ key: input.key }, this.jwtSecret, {
      expiresIn: expirationInSeconds
    })
    return { value: token }
  }

  async validate(
    { token }: TokenValidator.Params
  ): Promise<TokenValidator.Result> {
    const payload = verify(token, this.jwtSecret) as JwtPayload
    return payload.key
  }
}
