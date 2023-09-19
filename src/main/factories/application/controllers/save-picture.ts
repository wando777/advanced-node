import { SavePictureController } from '@/application/controllers/save-profile-picture'
import { makeChangeProfilePicture } from '../../domain/use-cases'

export const makeSavePictureController = (): SavePictureController => {
  return new SavePictureController(makeChangeProfilePicture())
}
