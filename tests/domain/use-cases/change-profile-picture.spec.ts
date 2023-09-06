import { mock } from 'jest-mock-extended'

describe('', () => {
  it('should call UploadFile with correct inputs', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const sut = setupChangeProfilePicture(fileStorage)

    await sut({ id: 'any_userId', file: Buffer.from('any_buffer') })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_userId' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})

type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile) => ChangeProfilePicture

const setupChangeProfilePicture: Setup = (fileStorage) => async ({ id, file }) => {
  await fileStorage.upload({ file, key: id })
}

interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}
