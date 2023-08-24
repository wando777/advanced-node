import { type FacebookAuthentication } from '@/domain/features'
import { makeFacebookApi, makeJwtGenerator } from '../../infra/gateways'
import { makePgUserAccountRepo } from '../../infra/repos'
import { FacebookAuthenticationService } from '@/domain/services'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return new FacebookAuthenticationService(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makePgUserAccountRepo(),
    makeJwtGenerator()
  )
}
