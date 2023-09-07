import { type UUIDGenerator, type UploadFile } from '../contracts/gateways'

type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ id, file }) => {
  if (file != null) {
    await fileStorage.upload({ file, key: crypto.generate({ key: id }) })
  }
}
