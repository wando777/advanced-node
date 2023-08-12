import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { badRequest, unauthorized, type HttpResponse, serverError, ok, type HttpRequest } from '../helpers'
import { type AccessToken } from '@/domain/models'
import { ValidationBuilder, ValidationComposite } from '../validation'

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
    const validators = ValidationBuilder
      .of({ value: httpRequest.token, fieldName: 'token' })
      .required()
      .build()

    return new ValidationComposite(validators).validate()
  }
}

type Output = Error | AccessToken

interface Controller {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
