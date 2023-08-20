import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { type HttpRequest, type HttpResponse, unauthorized, ok } from '../helpers'
import { type Validator, ValidationBuilder } from '../validation'
import { Controller } from './controller'

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) {
    super()
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse> {
    const res = await this.facebookAuth.perform({ token: httpRequest.token })
    return res instanceof AuthenticationError ? unauthorized() : ok(res)
  }

  override buildValidators(httpRequest: HttpRequest): Validator[] {
    return (ValidationBuilder
      .of({ value: httpRequest.token, fieldName: 'token' })
      .required()
      .build())
  }
}
