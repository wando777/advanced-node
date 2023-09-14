import { Controller } from '@/application/controllers'
import { type HttpResponse, noContent } from '@/application/helpers'
import { type ChangeProfilePicture } from '@/domain/use-cases'

describe('DeletePictureController', () => {
  let sut: DeletePictureController
  let changeProfilePicture: jest.Mock
  beforeAll(() => {
    changeProfilePicture = jest.fn()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new DeletePictureController(changeProfilePicture)
  })
  it('should extends Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
  it('should call ChangeProfilePicture with correct inputs', async () => {
    await sut.handle({ userId: 'any_user_id' })

    expect(changeProfilePicture).toHaveBeenCalledWith({ userId: 'any_user_id' })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
  it('should return 204', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id' })

    expect(httpResponse).toEqual({
      statusCode: 204,
      data: null
    })
  })
})

export class DeletePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  async perform(httpRequest: any): Promise<HttpResponse> {
    await this.changeProfilePicture(httpRequest)
    return noContent()
  }
}
