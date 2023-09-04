import { type FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi, makeJwtTokenHandler } from '../../infra/gateways'
import { makePgUserAccountRepo } from '../../infra/repos'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makePgUserAccountRepo(),
    makeJwtTokenHandler()
  )
}
