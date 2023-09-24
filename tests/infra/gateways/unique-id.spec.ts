import { UniqueId } from '@/infra/gateways'
import { set, reset } from 'mockdate'

describe('UniqueId', () => {
  let sut: UniqueId
  let key: string
  let date: Date
  beforeAll(() => {
    key = 'any_key'
    date = new Date(2021, 9, 10, 10, 10, 10)
    set(date)
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new UniqueId()
  })
  afterAll(() => {
    reset()
  })
  it('should return an unique id', () => {
    const uniqueId = sut.generate({ key })

    expect(uniqueId).toBe(`${key}_${date.getTime()}`)
  })
})
