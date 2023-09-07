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
