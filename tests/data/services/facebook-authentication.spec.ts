import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationService } from '@/data/contracts/services'
import { AuthenticationError } from '@/domain/errors'
import { mock } from 'jest-mock-extended'

// class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
//   token?: string
//   result: undefined
//   callsCount: number = 0
//   async loadUser(
//     params: LoadFacebookUserApi.Params
//   ): Promise<LoadFacebookUserApi.Result> {
//     this.token = params.token
//     this.callsCount++
//     return this.result
//   }
// }

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct parameter', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })
  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
