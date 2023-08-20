import { type HttpResponse, badRequest, serverError } from '../helpers'
import { type Validator, ValidationComposite } from '../validation'

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>

  buildValidators(httpRequest: any): Validator[] {
    return []
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const validation = this.validate(httpRequest)
    if (validation !== undefined) {
      return badRequest(validation)
    }
    try {
      return await this.perform(httpRequest)
    } catch (error) {
      return serverError(error as Error)
    }
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
