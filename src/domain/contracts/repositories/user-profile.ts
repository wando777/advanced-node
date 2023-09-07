export interface SaveUserPicture {
  savePicture: (
    params: SaveUserPicture.Input
  ) => Promise<SaveUserPicture.Output>
}

export namespace SaveUserPicture {
  export type Input = {
    pictureUrl?: string
  }
  export type Output = string
}

export interface LoadUserProfile {
  load: (
    params: LoadUserProfile.Input
  ) => Promise<void>
}

export namespace LoadUserProfile {
  export type Input = {
    id: string
  }
  export type UserData = {
    userId: string
    name?: string
    email?: string
  }
  export type Output = undefined | UserData
}
