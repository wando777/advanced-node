import { UUIDHandler } from '@/infra/gateways'
import { mocked } from 'jest-mock'
import { v4 } from 'uuid'

jest.mock('uuid')

describe('UUIDHandler', () => {
  let sut: UUIDHandler
  let key: string
  beforeAll(() => {
    key = 'any_key'
    mocked(v4).mockReturnValue('any_uuid')
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new UUIDHandler()
  })
  it('should call uuid v4', () => {
    sut.generate({ key })

    expect(v4).toHaveBeenCalledTimes(1)
  })
  it('should return correct uuid', () => {
    const uuid = sut.generate({ key })

    expect(uuid).toEqual(`${key}_any_uuid`)
  })
})
