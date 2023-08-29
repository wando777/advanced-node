import { type TokenValidator } from '../contracts/crypto'

type Input = { token: string }
type Output = string
type Setup = (crypto: TokenValidator) => Authorize
export type Authorize = (params: Input) => Promise<Output>

export const setupAuthorize: Setup = (crypto) => {
  return async (params) => {
    const userId = await crypto.validateToken(params)
    return userId
  }
}
