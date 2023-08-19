import { JwtTokenGenerator } from '@/infra/crypto'
import env from '@/main/config/env'

export const makeJwtGenerator = (): JwtTokenGenerator => {
  return new JwtTokenGenerator(env.jwtSecret)
}
