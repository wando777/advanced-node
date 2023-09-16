import { Controller } from '@/application/controllers'
import { SavePictureController } from '@/application/controllers/save-profile-picture'
import { InvalidMymeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'

describe('SavePictureController', () => {
  let sut: SavePictureController
  let buffer: Buffer
  let mimeType: string
  let changeProfilePicture: jest.Mock
  let userId: string
  // let file: { buffer: Buffer, mimeType: string }
  beforeAll(() => {
    userId = 'any_userId'
    changeProfilePicture = jest.fn().mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' })
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
    await sut.handle({ file: { buffer, mimeType }, userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file: buffer })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })
  it('should return 200', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType }, userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', pictureUrl: 'any_url' }
    })
  })
})
