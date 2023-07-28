import { type LoadFacebookUserApi } from '../apis/facebook'
import {
  type LoadUserAccountRepository,
  type SaveUserAccountFromFacebookRepository
} from '../repositories'
import { type FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly saveAccountFromFacebookRepository: SaveUserAccountFromFacebookRepository
  ) { }

  async perform(
    param: FacebookAuthentication.Params
  ): Promise<FacebookAuthentication.Result> {
    const facebookUserData = await this.loadFacebookUserApi.loadUser(param)
    if (facebookUserData !== undefined) {
      const userData = await this.loadUserAccountRepository.load(
        facebookUserData
      )
      await this.saveAccountFromFacebookRepository.saveWithFacebook({
        userId: userData?.userId,
        name: userData?.name ?? facebookUserData.name,
        email: facebookUserData.email,
        facebookId: facebookUserData.facebookId
      })
    }
    return new AuthenticationError()
  }
}
