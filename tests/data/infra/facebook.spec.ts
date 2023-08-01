import { FacebookApi } from '@/data/infra/apis/facebook-api'
import { type HttpGetClient } from '@/data/infra/gateways/client'
import { mock, type MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let sut: FacebookApi
  let clientToken: string
  let baseUrl: string
  let httpGetClient: MockProxy<HttpGetClient>
  beforeAll(() => {
    httpGetClient = mock()
    clientToken = 'any_client_token'
    baseUrl = 'https://graph.facebook.com'
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new FacebookApi(httpGetClient)
  })
  it('should get app token', async () => {
    await sut.loadUser({ token: clientToken })
    expect(httpGetClient.get).toHaveBeenCalledWith({ url: `${baseUrl}/oauth/access_token` })
  })
})
