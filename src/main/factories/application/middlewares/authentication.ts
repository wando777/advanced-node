import { makeJwtTokenHandler } from '@/main/factories/infra/gateways'
import { AuthenticationMiddleware } from '@/application/middlewares'
import { setupAuthorize } from '@/domain/use-cases'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const authorize = setupAuthorize(makeJwtTokenHandler())
  return new AuthenticationMiddleware(authorize)
}
