import { type FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi, makeJwtGenerator } from '../../infra/gateways'
import { makePgUserAccountRepo } from '../../infra/repos'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makePgUserAccountRepo(),
    makeJwtGenerator()
  )
}
