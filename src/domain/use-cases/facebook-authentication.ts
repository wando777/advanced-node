import { type FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { type TokenGenerator } from '../contracts/crypto'
import {
  type LoadUserAccountRepository,
  type SaveUserAccountFromFacebookRepository
} from '../contracts/repositories'
import { type LoadFacebookUserApi } from '../contracts/apis'

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly saveAccountFromFacebookRepository: SaveUserAccountFromFacebookRepository,
    private readonly cryptyo: TokenGenerator
  ) { }

  async perform(
    input: FacebookAuthentication.Input
  ): Promise<FacebookAuthentication.Output> {
    const facebookUserData = await this.loadFacebookUserApi.loadUser(input)
    if (facebookUserData !== undefined) {
      const userData = await this.loadUserAccountRepository.load(
        facebookUserData
      )
      const fbAccount = new FacebookAccount(facebookUserData, userData)
      const newAccount =
        await this.saveAccountFromFacebookRepository.saveWithFacebook(fbAccount)
      const token = await this.cryptyo.generateToken({
        key: newAccount.userId,
        expirationInMs: AccessToken.expirationInMs
      })
      return new AccessToken(token.value)
    }
    return new AuthenticationError()
  }
}
