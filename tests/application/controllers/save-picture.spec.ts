import { Controller } from '@/application/controllers'
import { SavePictureController } from '@/application/controllers/save-profile-picture'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation'

describe('SavePictureController', () => {
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }
  let userId: string
  let sut: SavePictureController
  let changeProfilePicture: jest.Mock
  beforeAll(() => {
    userId = 'any_userId'
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
    changeProfilePicture = jest.fn().mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' })
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new SavePictureController(changeProfilePicture)
  })
  it('should extends Controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })
  it('should build Validators correctly on save', async () => {
    const validators = sut.buildValidators({ file, userId })

    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
  })
  it('should build Validators correctly on delete', async () => {
    const validators = sut.buildValidators({ file: undefined, userId })

    expect(validators).toEqual([])
  })
  it('should call ChangeProfilePicture with correct inputs', async () => {
    await sut.handle({ file: { buffer, mimeType }, userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file })
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
