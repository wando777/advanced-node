import { type AccessToken } from '@/domain/models'
import { type AuthenticationError } from '@/domain/errors'

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
