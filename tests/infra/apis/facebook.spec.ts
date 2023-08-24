import {
  FacebookApi,
  type ClientCredentials,
  type DebugCredentials
} from '@/infra/apis'
import { type HttpGetClient } from '@/infra/gateways'
import { type FacebookAccountModel } from '@/domain/entities'
import { type MockProxy, mock } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let sut: FacebookApi
  let clientToken: string
  let baseUrl: string
  let httpGetClient: MockProxy<HttpGetClient>
  let clientCredentials: object
  let debugCredentials: DebugCredentials
  let userId: string
  let facebookUserInfo: object
  let facebookUserMock: FacebookAccountModel
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
    facebookUserInfo = {
      fields: 'id,name,email',
      access_token: debugCredentials.input_token
    }
    userId = 'any_user_id'
    facebookUserMock = {
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    }
  })
  beforeEach(() => {
    jest.clearAllMocks()
    httpGetClient.get
      .mockResolvedValueOnce({ access_token: debugCredentials.access_token })
      .mockResolvedValueOnce({ data: { user_id: userId } })
      .mockResolvedValueOnce(facebookUserMock)
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
  it('should get user info', async () => {
    await sut.loadUser({ token: clientToken })
    expect(httpGetClient.get).toHaveBeenCalledWith({
      url: `${baseUrl}/${userId}`,
      params: facebookUserInfo
    })
  })
  it('should returns facebook user info', async () => {
    const facebookUser = await sut.loadUser({ token: clientToken })
    expect(facebookUser).toEqual(facebookUserMock)
  })
  it('should returns undefined if HttpGetClient throws', async () => {
    httpGetClient.get.mockReset().mockRejectedValueOnce(new Error('fb_error'))

    const facebookUser = await sut.loadUser({ token: clientToken })

    expect(facebookUser).toBeUndefined()
  })
})
