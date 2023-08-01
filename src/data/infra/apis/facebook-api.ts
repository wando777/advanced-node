/* eslint-disable @typescript-eslint/naming-convention */
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type HttpGetClient } from '../gateways'

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  constructor(
    private readonly httpGetClient: HttpGetClient,
    private readonly clientCredentials: ClientCredentials
  ) { }

  async loadUser(
    input: LoadFacebookUserApi.Input
  ): Promise<LoadFacebookUserApi.Result> {
    const { client_id, client_secret } = this.clientCredentials
    const appToken = await this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id,
        client_secret,
        grant_type: 'client_credentials'
      }
    })
    await this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: input.token
      }
    })
    return await new Promise((resolve) => {
      resolve(undefined)
    })
  }
}

export type ClientCredentials = {
  client_id: string
  client_secret: string
}

export type DebugCredentials = {
  access_token: string
  input_token: string
}
