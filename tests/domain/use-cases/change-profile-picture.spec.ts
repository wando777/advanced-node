import { type UUIDGenerator, type UploadFile } from '@/domain/contracts/gateways'
import { type SaveUserPicture } from '@/domain/contracts/repositories'
import { type ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    crypto.generate.mockReturnValue(uuid)
    userProfileRepo = mock()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })
  it('should call UploadFile with correct inputs', async () => {
    await sut({ id: 'any_userId', file: Buffer.from('any_buffer') })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_userId', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
  it('should call SaveUserPicture (repository) with correct input', async () => {
    await sut({ id: 'any_userId', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: 'any_url' })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
  it('hould call SaveUserPicture (repository) with correct input when file is undefined', async () => {
    await sut({ id: 'any_userId', file: undefined })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
})
