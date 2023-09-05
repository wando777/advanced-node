import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import {
  type LoadUserAccountRepository,
  type SaveUserAccountFromFacebookRepository
} from '../contracts/repositories'
import { type TokenGenerator, type LoadFacebookUser } from '../contracts/gateways'

type Input = { token: string }
type Output = { accessToken: string }
export type FacebookAuthentication = (params: Input) =>
Promise<Output>
type SetupTypes = (
  facebook: LoadFacebookUser,
  loadUserAccountRepository: LoadUserAccountRepository,
  saveAccountFromFacebookRepository: SaveUserAccountFromFacebookRepository,
  token: TokenGenerator
) => FacebookAuthentication

export const setupFacebookAuthentication: SetupTypes = (
  facebook,
  loadUserAccountRepository,
  saveAccountFromFacebookRepository,
  token
) => {
  return async (params) => {
    const facebookUserData = await facebook.loadUser(params)
    if (facebookUserData !== undefined) {
      const userData = await loadUserAccountRepository.load(
        facebookUserData
      )
      const fbAccount = new FacebookAccount(facebookUserData, userData)
      const newAccount =
        await saveAccountFromFacebookRepository.saveWithFacebook(fbAccount)
      const returnedToken = await token.generate({
        key: newAccount.userId,
        expirationInMs: AccessToken.expirationInMs
      })
      return { accessToken: returnedToken.value }
    }
    throw new AuthenticationError()
  }
}
