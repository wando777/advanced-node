import { type UUIDGenerator, type UploadFile } from '@/domain/contracts/gateways'
import { type LoadUserProfile, type SaveUserPicture } from '@/domain/contracts/repositories'
import { UserProfile } from '@/domain/entities'
import { type ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { type MockProxy, mock } from 'jest-mock-extended'
import { mocked } from 'jest-mock'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    crypto.generate.mockReturnValue(uuid)
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({ name: 'Wando H A Leite' })
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

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(
      ...mocked(UserProfile).mock.instances
    )
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
  it('should call LoadUserProfile (repository) with correct inputs', async () => {
    await sut({ id: 'any_userId', file: undefined })

    expect(userProfileRepo.load).toHaveBeenCalledWith({ id: 'any_userId' })
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1)
  })
  it('should not call LoadUserProfile (repository) if file exists', async () => {
    await sut({ id: 'any_userId', file })

    expect(userProfileRepo.load).not.toHaveBeenCalled()
  })
})
