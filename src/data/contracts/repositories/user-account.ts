export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
  export type userData = {
    userId: string
    name?: string
    email: string
  }
  export type Result = undefined | userData
}

export interface SaveUserAccountFromFacebookRepository {
  saveWithFacebook: (
    params: SaveUserAccountFromFacebookRepository.Params
  ) => Promise<void>
}

export namespace SaveUserAccountFromFacebookRepository {
  export type Params = {
    userId?: string
    email: string
    name: string
    facebookId: string
  }
}
