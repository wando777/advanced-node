import { makeFacebookApi, makeJwtGenerator } from '../../infra/gateways'
import { makePgUserAccountRepo } from '../../infra/repos'
import { FacebookAuthenticationUseCase } from '@/domain/use-cases'

export const makeFacebookAuthentication = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makePgUserAccountRepo(),
    makeJwtGenerator()
  )
}
