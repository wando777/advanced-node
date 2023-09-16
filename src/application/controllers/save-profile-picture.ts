import { type ChangeProfilePicture } from '@/domain/use-cases'
import { RequiredFieldError, InvalidMymeTypeError, MaxFileSizeError } from '../errors'
import { type HttpResponse, badRequest, ok } from '../helpers'
import { Controller } from './controller'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }

export class SavePictureController extends Controller {
  static readonly MAX_FILE_SIZE: number = 5 * 1024 * 1024

  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform({ file, userId }: HttpRequest): Promise<HttpResponse> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) return badRequest(new InvalidMymeTypeError(['png', 'jpeg']))
    if (file.buffer.length > SavePictureController.MAX_FILE_SIZE) return badRequest(new MaxFileSizeError(5))
    const userProfile = await this.changeProfilePicture({ id: userId, file: file.buffer })
    return ok(userProfile)
  }
}
