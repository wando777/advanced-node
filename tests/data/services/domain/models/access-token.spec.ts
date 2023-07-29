import { AccessToken } from '@/domain/models'

describe('AccessToken', () => {
  let sut: AccessToken
  const input = 'any_value'
  beforeEach(() => {
    sut = new AccessToken(input)
  })

  it('Should create a new token with a value', async () => {
    expect(sut).toEqual({ value: input })
  })
})
