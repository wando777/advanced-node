import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type HttpGetClient } from '../gateways/client'

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor(private readonly httpGetClient: HttpGetClient) { }
  async loadUser(input: LoadFacebookUserApi.Input): Promise<LoadFacebookUserApi.Result> {
    await this.httpGetClient.get({ url: `${this.baseUrl}/oauth/access_token` })
    return await new Promise(resolve => { resolve(undefined) })
  }
}
