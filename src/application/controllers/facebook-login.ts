import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { badRequest, unauthorized, type HttpResponse, serverError, ok, type HttpRequest } from '../helpers'
import { RequiredFieldError } from '../errors'
import { type AccessToken } from '@/domain/models'

export class FacebookLoginController implements Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) { }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Output>> {
    const validation = this.validate(httpRequest)
    if (validation !== undefined) {
      return badRequest(validation)
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

  private validate(httpRequest: HttpRequest): Error | undefined {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!httpRequest?.token || Object.keys(httpRequest.token).length === 0) {
      return new RequiredFieldError('token')
    }
  }
}

type Output = Error | AccessToken

interface Controller {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
