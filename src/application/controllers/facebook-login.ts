import { type FacebookAuthentication } from '@/domain/use-cases'
import { type HttpRequest, type HttpResponse, unauthorized, ok } from '../helpers'
import { type Validator, ValidationBuilder } from '../validation'
import { Controller } from './controller'

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuth: FacebookAuthentication) {
    super()
  }

  async perform({ token }: HttpRequest): Promise<HttpResponse> {
    try {
      const res = await this.facebookAuth({ token })
      return ok(res)
    }
    catch {
      return unauthorized()
    }
  }

  override buildValidators({ token }: HttpRequest): Validator[] {
    return (ValidationBuilder
      .of({ value: token, fieldName: 'token' })
      .required()
      .build())
  }
}
