import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { type TokenGenerator } from '../contracts/crypto'
import {
  type LoadUserAccountRepository,
  type SaveUserAccountFromFacebookRepository
} from '../contracts/repositories'
import { type LoadFacebookUserApi } from '../contracts/apis'

type Input = { token: string }
type Output = { accessToken: string }
export type FacebookAuthentication = (params: Input) =>
Promise<Output>
type SetupTypes = (
  loadFacebookUserApi: LoadFacebookUserApi,
  loadUserAccountRepository: LoadUserAccountRepository,
  saveAccountFromFacebookRepository: SaveUserAccountFromFacebookRepository,
  cryptyo: TokenGenerator
) => FacebookAuthentication

export const setupFacebookAuthentication: SetupTypes = (
  loadFacebookUserApi,
  loadUserAccountRepository,
  saveAccountFromFacebookRepository,
  cryptyo
) => {
  return async (params) => {
    const facebookUserData = await loadFacebookUserApi.loadUser(params)
    if (facebookUserData !== undefined) {
      const userData = await loadUserAccountRepository.load(
        facebookUserData
      )
      const fbAccount = new FacebookAccount(facebookUserData, userData)
      const newAccount =
        await saveAccountFromFacebookRepository.saveWithFacebook(fbAccount)
      const token = await cryptyo.generateToken({
        key: newAccount.userId,
        expirationInMs: AccessToken.expirationInMs
      })
      return { accessToken: token.value }
    }
    throw new AuthenticationError()
  }
}