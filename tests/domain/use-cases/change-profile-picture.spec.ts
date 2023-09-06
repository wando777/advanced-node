import { type MockProxy, mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    crypto = mock()
    crypto.generate.mockReturnValue(uuid)
  })
  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto)
  })
  it('should call UploadFile with correct inputs', async () => {
    await sut({ id: 'any_userId', file: Buffer.from('any_buffer') })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})

type Input = { id: string, file: Buffer }
type ChangeProfilePicture = (input: Input) => Promise<void>
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture

const setupChangeProfilePicture: Setup = (fileStorage, crypto) => async ({ id, file }) => {
  await fileStorage.upload({ file, key: crypto.generate({ key: id }) })
}

interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}

interface UUIDGenerator {
  generate: (input: UUIDGenerator.Input) => UUIDGenerator.Output
}

namespace UUIDGenerator {
  export type Input = { key: string }
  export type Output = string
}
