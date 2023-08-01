export interface LoadFacebookUserApi {
  loadUser: (
    input: LoadFacebookUserApi.Input
  ) => Promise<LoadFacebookUserApi.Result>
}

export namespace LoadFacebookUserApi {
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
