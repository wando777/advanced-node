import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  let sut: AccessToken
  const input = 'any_value'
  const expirationTimeInMs = 30 * 60 * 1000
  beforeEach(() => {
    sut = new AccessToken(input)
  })

  it('Should create a new token with a value', async () => {
    expect(sut).toEqual({ value: input })
  })
  it('Should verify the token expiration within 30 minutes', async () => {
    expect(AccessToken.expirationInMs).toBe(expirationTimeInMs)
  })
})
