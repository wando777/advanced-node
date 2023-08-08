import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { type HttpResponse } from '../helpers'

export class FacebookLoginController implements Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) {}
  async handle(httpRequest: any): Promise<HttpResponse> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!httpRequest?.token || Object.keys(httpRequest.token).length === 0) {
      return {
        statusCode: 400,
        data: new Error('A valid token must be provided')
      }
    }
    try {
      const res = await this.facebookAuth.perform({ token: httpRequest.token })
      if (res instanceof AuthenticationError) {
        return {
          statusCode: 401,
          data: res
        }
      }
      return {
        statusCode: 200,
        data: res
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: error
      }
    }
  }
}

interface Controller {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
