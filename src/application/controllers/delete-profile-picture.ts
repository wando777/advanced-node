import { type ChangeProfilePicture } from '@/domain/use-cases'
import { type HttpResponse, noContent } from '../helpers'
import { Controller } from './controller'

export class DeletePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform(httpRequest: any): Promise<HttpResponse> {
    await this.changeProfilePicture(httpRequest)
    return noContent()
  }
}
