import { type AccessToken } from '@/domain/entities'
import { type AuthenticationError } from '@/domain/entities/errors'

export interface FacebookAuthentication {
  perform: (
    input: FacebookAuthentication.Input
  ) => Promise<FacebookAuthentication.Output>
}

export namespace FacebookAuthentication {
  export type Input = {
    token: string
  }
  export type Output = AccessToken | AuthenticationError
}
