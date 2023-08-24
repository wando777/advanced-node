export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Input
  ) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Input = {
    email: string
  }
  export type UserData = {
    userId: string
    name?: string
    email?: string
  }
  export type Result = undefined | UserData
}

export interface SaveUserAccountFromFacebookRepository {
  saveWithFacebook: (
    params: SaveUserAccountFromFacebookRepository.Input
  ) => Promise<SaveUserAccountFromFacebookRepository.Result>
}

export namespace SaveUserAccountFromFacebookRepository {
  export type Input = {
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
