import { JwtTokenHandler } from '@/infra/crypto'
import env from '@/main/config/env'

export const makeJwtGenerator = (): JwtTokenHandler => {
  return new JwtTokenHandler(env.jwtSecret)
}
