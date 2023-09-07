import { type UUIDGenerator, type UploadFile } from '../contracts/gateways'
import { type SaveUserPicture, type LoadUserProfile } from '../contracts/repositories'

type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  let pictureUrl: string | undefined
  if (file != null) {
    pictureUrl = await fileStorage.upload({ file, key: crypto.generate({ key: id }) })
  }
  await userProfileRepo.savePicture({ pictureUrl })
  await userProfileRepo.load({ id })
}
