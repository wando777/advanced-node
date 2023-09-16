import { Controller } from '@/application/controllers'
import { RequiredFieldError } from '@/application/errors'
import { type HttpResponse, badRequest } from '@/application/helpers'
import { type ChangeProfilePicture } from '@/domain/use-cases'

describe('SavePictureController', () => {
  let sut: SavePictureController
  let buffer: Buffer
  let mimeType: string
  let changeProfilePicture: jest.Mock
  let userId: string
  // let file: { buffer: Buffer, mimeType: string }
  beforeAll(() => {
    userId = 'any_userId'
    changeProfilePicture = jest.fn()
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new SavePictureController(changeProfilePicture)
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
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })
  it('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpeg'])
    })
  })
  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpeg'])
    })
  })
  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpeg'])
    })
  })
  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMymeTypeError(['png', 'jpeg'])
    })
  })
  it('should not return 400 if file size is invalid', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))

    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5)
    })
  })
  it('should call ChangeProfilePicture with correct inputs', async () => {
    await sut.handle({ file: { buffer, mimeType: 'image/jpg' }, userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file: buffer })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
})

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
    await this.changeProfilePicture({ id: userId, file: file.buffer })
    return await new Promise(resolve => { resolve({ statusCode: 200, data: null }) })
  }
}

class InvalidMymeTypeError extends Error {
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  constructor(allowed: string[]) {
    super(`Allowed types: ${allowed}`)
    this.name = 'InvalidMymeTypeError'
  }
}
class MaxFileSizeError extends Error {
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  constructor(maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}mb`)
    this.name = 'MaxFileSizeError'
  }
}
