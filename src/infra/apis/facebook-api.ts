/* eslint-disable @typescript-eslint/naming-convention */
import { type LoadFacebookUser } from '@/domain/contracts/gateways'
import { type HttpGetClient } from '../gateways'

export class FacebookApi implements LoadFacebookUser {
  private readonly baseUrl = 'https://graph.facebook.com'
  private readonly client_id = this.clientCredentials.client_id
  private readonly client_secret = this.clientCredentials.client_secret

  constructor(
    private readonly httpGetClient: HttpGetClient,
    private readonly clientCredentials: ClientCredentials
  ) { }

  async loadUser(
    input: Input
  ): Promise<Result> {
    try {
      const facebookUser: LoadFacebookUser.FacebookUserData =
        await this.getUserInfo(input.token)
      return facebookUser
    } catch {
      return undefined
    }
  }

  private async getAppToken(): Promise<AppToken> {
    return await this.httpGetClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.client_id,
        client_secret: this.client_secret,
        grant_type: 'client_credentials'
      }
    })
  }

  private async getDebugToken(clientToken: string): Promise<DebugToken> {
    const appToken = await this.getAppToken()
    return await this.httpGetClient.get({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken
      }
    })
  }

  private async getUserInfo(clientToken: string): Promise<any> {
    const debugToken = await this.getDebugToken(clientToken)
    return await this.httpGetClient.get({
      url: `${this.baseUrl}/${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken
      }
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

type AppToken = {
  access_token: string
}

type DebugToken = {
  data: {
    user_id: string
  }
}

type Result = LoadFacebookUser.Result
type Input = LoadFacebookUser.Input
