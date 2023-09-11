import { UniqueId } from '@/infra/gateways'

describe('UUIDHandler', () => {
  let sut: UniqueId
  let key: string
  let date: Date
  beforeAll(() => {
    key = 'any_key'
    date = new Date(2021, 9, 10, 10, 10, 10)
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new UniqueId(date)
  })
  it('should return an unique id', () => {
    const uniqueId = sut.generate({ key })

    expect(uniqueId).toBe(`${key}_${date.getTime()}`)
  })
})
