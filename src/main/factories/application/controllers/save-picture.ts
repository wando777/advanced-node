import { SavePictureController } from '@/application/controllers/save-profile-picture'
import { makeChangeProfilePicture } from '../../domain/use-cases'
import { type Controller } from '@/application/controllers'
import { makePgTransactionController } from '../decorators'

export const makeSavePictureController = (): Controller => {
  const controller = new SavePictureController(makeChangeProfilePicture())
  return makePgTransactionController(controller)
}
