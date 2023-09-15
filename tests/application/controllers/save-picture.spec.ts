import { Controller } from '@/application/controllers'
import { RequiredFieldError } from '@/application/errors'
import { type HttpResponse, badRequest } from '@/application/helpers'

describe('SavePictureController', () => {
  let sut: SavePictureController
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new SavePictureController()
  })
  it('should extends Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
  it('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from('') } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
})

type HttpRequest = { file: { buffer: Buffer } }

export class SavePictureController extends Controller {
  async perform({ file }: HttpRequest): Promise<HttpResponse> {
    return badRequest(new RequiredFieldError('file'))
  }
}
