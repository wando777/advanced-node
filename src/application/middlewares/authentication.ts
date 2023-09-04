import { type Authorize } from '@/domain/use-cases'
import { type HttpResponse, forbidden, ok } from '../helpers'
import { Required } from '../validation'
import { type Middleware } from './middleware'

type HttpRequest = {
  authorization: string
}

type Model = Error | { userId: string }

export class AuthenticationMiddleware implements Middleware {
  constructor(private readonly authorize: Authorize) {
  }

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    const isError = this.validate({ authorization })
    if (isError) {
      return forbidden()
    }
    try {
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private validate({ authorization }: HttpRequest): boolean {
    const error = new Required(authorization, 'authorization').validate()
    return !(error === undefined)
  }
}
