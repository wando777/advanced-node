import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '../apis/facebook'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) { }

  async perform(
    param: FacebookAuthentication.Params
  ): Promise<FacebookAuthentication.Result> {
    await this.loadFacebookUserApi.loadUser(param)
    return new AuthenticationError()
  }
}
