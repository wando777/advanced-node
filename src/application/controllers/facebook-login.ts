import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { badRequest, unauthorized, type HttpResponse, serverError, ok } from '../helpers'
import { RequiredFieldError } from '../errors'

export class FacebookLoginController implements Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) { }
  async handle(httpRequest: any): Promise<HttpResponse> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!httpRequest?.token || Object.keys(httpRequest.token).length === 0) {
      return badRequest(new RequiredFieldError('token'))
    }
    try {
      const res = await this.facebookAuth.perform({ token: httpRequest.token })
      if (res instanceof AuthenticationError) {
        return unauthorized()
      }
      return ok(res)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

interface Controller {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
