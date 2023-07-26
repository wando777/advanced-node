import { type LoadFacebookUserApi } from '../apis/facebook'
import { type LoadUserAccountRepository } from '../repositories'
import { type FacebookAuthentication } from '@/domain/features'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository) { }

  async perform(
    param: FacebookAuthentication.Params
  ): Promise<FacebookAuthentication.Result> {
    const facebookUserData = await this.loadFacebookUserApi.loadUser(param)
    if (facebookUserData !== undefined) {
      await this.loadUserAccountRepository.load(facebookUserData)
    }
    return new AuthenticationError()
  }
}
