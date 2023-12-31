import { type DeleteFile, type UUIDGenerator, type UploadFile } from '../contracts/gateways'
import { type SaveUserPicture, type LoadUserProfile } from '../contracts/repositories'
import { UserProfile } from '../entities'

type Input = { id: string, file?: { buffer: Buffer, mimeType: string } }
type Output = { pictureUrl?: string, initials?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>
type Setup = (
  fileStorage: UploadFile & DeleteFile,
  crypto: UUIDGenerator,
  userProfileRepo: SaveUserPicture & LoadUserProfile
) => ChangeProfilePicture

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  const key = crypto.generate({ key: id })
  const data: { pictureUrl?: string, name?: string } = {}
  if (file != null) {
    data.pictureUrl = await fileStorage.upload({ file: file.buffer, key: `${key}.${file.mimeType.split('/')[1]}` })
  } else {
    data.name = (await userProfileRepo.load({ id }))?.name
  }
  const userProfile = new UserProfile(id)
  userProfile.setPicture(data)
  try {
    await userProfileRepo.savePicture(userProfile)
  } catch (e) {
    if (file !== undefined) await fileStorage.delete({ key })
    throw e
  }
  return userProfile
}
