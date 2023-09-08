export interface SaveUserPicture {
  savePicture: (
    params: SaveUserPicture.Input
  ) => Promise<SaveUserPicture.Output>
}

export namespace SaveUserPicture {
  export type Input = {
    id: string
    pictureUrl?: string
    initials?: string
  }
  export type Output = string
}

export interface LoadUserProfile {
  load: (
    params: LoadUserProfile.Input
  ) => Promise<LoadUserProfile.Output>
}

export namespace LoadUserProfile {
  export type Input = {
    id: string
  }
  export type Output = {
    name?: string
  }
}
