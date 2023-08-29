import { AccessToken } from '@/domain/entities'

describe('AccessToken', () => {
  const expirationTimeInMs = 30 * 60 * 1000
  it('Should verify the token expiration within 30 minutes', async () => {
    expect(AccessToken.expirationInMs).toBe(expirationTimeInMs)
  })
})
