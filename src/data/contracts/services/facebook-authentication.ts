import { type LoadFacebookUserApi } from '../apis/facebook'
import {
  type UpdateUserAccountFromFacebookRepository,
  type CreateUserAccountFromFacebookRepository,
  type LoadUserAccountRepository
} from '../repositories'
import { type FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createUserAccountFromFacebookRepository: CreateUserAccountFromFacebookRepository,
    private readonly updateUserAccountFromFacebookRepository: UpdateUserAccountFromFacebookRepository
  ) { }

  async perform(
    param: FacebookAuthentication.Params
  ): Promise<FacebookAuthentication.Result> {
    const facebookUserData = await this.loadFacebookUserApi.loadUser(param)
    if (facebookUserData !== undefined) {
      const userData = await this.loadUserAccountRepository.load(
        facebookUserData
      )
      if (userData?.name !== undefined) {
        await this.updateUserAccountFromFacebookRepository.updateWithFacebook({
          userId: userData.userId,
          name: userData.name,
          facebookId: facebookUserData.facebookId
        })
      } else {
        await this.createUserAccountFromFacebookRepository.createFromFacebook(
          facebookUserData
        )
      }
    }
    return new AuthenticationError()
  }
}
