import { FacebookApi, type ClientCredentials, type DebugCredentials } from '@/data/infra/apis'
import { type HttpGetClient } from '@/data/infra/gateways'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let sut: FacebookApi
  let clientToken: string
  let baseUrl: string
  let httpGetClient: MockProxy<HttpGetClient>
  let clientCredentials: object
  let debugCredentials: DebugCredentials
  beforeAll(() => {
    httpGetClient = mock()
    clientToken = 'any_client_token'
    baseUrl = 'https://graph.facebook.com'
    clientCredentials = {
      client_id: 'any_client_id',
      client_secret: 'any_client_secret',
      grant_type: 'client_credentials'
    }
    debugCredentials = {
      access_token: 'any_app_token',
      input_token: 'any_client_token'
    }
  })
  beforeEach(() => {
    jest.clearAllMocks()
    httpGetClient.get.mockResolvedValueOnce({ access_token: debugCredentials.access_token })
    sut = new FacebookApi(httpGetClient, clientCredentials as ClientCredentials)
  })
  it('should get app token', async () => {
    await sut.loadUser({ token: clientToken })
    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: `${baseUrl}/oauth/access_token`,
      params: clientCredentials
    })
  })
  it('should get debuged token', async () => {
    await sut.loadUser({ token: clientToken })
    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: `${baseUrl}/debug_token`,
      params: debugCredentials
    })
  })
})
