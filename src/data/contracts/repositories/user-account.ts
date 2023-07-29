export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }
  export type UserData = {
    userId: string
    name?: string
    email: string
  }
  export type Result = undefined | UserData
}

export interface SaveUserAccountFromFacebookRepository {
  saveWithFacebook: (
    params: SaveUserAccountFromFacebookRepository.Params
  ) => Promise<SaveUserAccountFromFacebookRepository.Result>
}

export namespace SaveUserAccountFromFacebookRepository {
  export type Params = {
    userId?: string
    email: string
    name: string
    facebookId: string
  }
  export type NewUserId = {
    userId: string
  }
  export type Result = NewUserId
}
