import { type ChangeProfilePicture } from '@/domain/use-cases'
import { type HttpResponse, ok } from '../helpers'
import { Controller } from './controller'
import { ValidationBuilder, type Validator } from '../validation'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }

export class SavePictureController extends Controller {
  static readonly MAX_FILE_SIZE: number = 5 * 1024 * 1024

  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform({ file, userId }: HttpRequest): Promise<HttpResponse> {
    const userProfile = await this.changeProfilePicture({ id: userId, file })
    return ok(userProfile)
  }

  override buildValidators({ file }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: file, fieldName: 'file' })
        .required()
        .image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 })
        .build()
    ]
  }
}
