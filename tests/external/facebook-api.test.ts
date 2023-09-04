import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/gateways'
import { env } from '@/main/config/env'

describe('Facebook Api integration tests', () => {
  let sut: FacebookApi
  let axiosClient: AxiosHttpClient
  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(axiosClient, {
      client_id: env.facebookApi.clientId,
      client_secret: env.facebookApi.clientSecret
    })
  })
  it('should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({ token: env.facebookApi.accessToken })

    expect(fbUser).toEqual({
      id: '7184434554919380',
      name: 'Wanderson Aragão',
      email: 'wanderson._a@hotmail.com'
    })
  })
  it('should return a undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid_token' })

    expect(fbUser).toBeUndefined()
  })
})
