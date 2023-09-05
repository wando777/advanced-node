export interface LoadFacebookUser {
  loadUser: (
    input: LoadFacebookUser.Input
  ) => Promise<LoadFacebookUser.Result>
}

export namespace LoadFacebookUser {
  export type Input = {
    token: string
  }
  export type FacebookUserData = {
    facebookId: string
    email: string
    name: string
  }
  export type Result = undefined | FacebookUserData
}
