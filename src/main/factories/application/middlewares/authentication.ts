import { makeJwtTokenHandler } from '@/main/factories/infra/gateways'
import { AuthenticationMiddleware } from '@/application/middlewares'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJwtTokenHandler()
  return new AuthenticationMiddleware(jwt.validateToken.bind(jwt))
}
