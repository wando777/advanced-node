import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/gateways'
import env from '@/main/config/env'

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
    const fbUser = await sut.loadUser({ token: 'EAAOObZCpz90gBO6WyjV5IExwwnGKrnSVZC2x1xytgR5J6Pro9OQvl1679vDgOYhqJtUZCNftkO195kFINZCo5TPZCI1kotEqP2FYjrOoHk8ZCAnXZCx8dDrZCvUEmZBWLZAlUDEvdm54t5QXCVvFYyW6PwuyDWjOXzoZBefsWd1gm8PS3prM4osgV0KHgEGU4lWrJ7TXHNHS3Qbcvu7cAQE1asuWuHHJL9dHYVj64iyIt6RmCuBiaRgRWevtZBQvw4dRJAZDZD' })

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
