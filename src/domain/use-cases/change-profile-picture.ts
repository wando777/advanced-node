import { type UUIDGenerator, type UploadFile } from '../contracts/gateways'
import { type SaveUserPicture } from '../contracts/repositories'

type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  if (file != null) {
    const pictureUrl = await fileStorage.upload({ file, key: crypto.generate({ key: id }) })
    await userProfileRepo.savePicture({ pictureUrl })
  }
}
