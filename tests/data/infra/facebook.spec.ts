import { FacebookApi, type ClientCredentials } from '@/data/infra/apis'
import { type HttpGetClient } from '@/data/infra/gateways'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let sut: FacebookApi
  let clientToken: string
  let baseUrl: string
  let httpGetClient: MockProxy<HttpGetClient>
  let clientCredentials: object
  beforeAll(() => {
    httpGetClient = mock()
    clientToken = 'any_client_token'
    baseUrl = 'https://graph.facebook.com'
    clientCredentials = {
      client_id: 'any_client_id',
      client_secret: 'any_client_secret',
      grant_type: 'client_credentials'
    }
  })
  beforeEach(() => {
    jest.clearAllMocks()
    sut = new FacebookApi(httpGetClient, clientCredentials as ClientCredentials)
  })
  it('should get app token', async () => {
    await sut.loadUser({ token: clientToken })
    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: `${baseUrl}/oauth/access_token`,
      params: clientCredentials
    })
  })
})
