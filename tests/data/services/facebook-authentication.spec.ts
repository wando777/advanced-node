import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type CreateUserAccountFromFacebookRepository, type LoadUserAccountRepository } from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/contracts/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, type MockProxy } from 'jest-mock-extended'

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
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let createUserAccountFromFacebookRepository: MockProxy<CreateUserAccountFromFacebookRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'
  const facebookUserMock: LoadFacebookUserApi.FacebookUserData = {
    facebookId: 'any_fb_id',
    name: 'any_fb_name',
    email: 'any_fb_email'
  }

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadUserAccountRepository = mock()
    createUserAccountFromFacebookRepository = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue(facebookUserMock)
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepository, createUserAccountFromFacebookRepository)
  })

  it('Should call LoadFacebookUserApi with correct parameter', async () => {
    await sut.perform({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })
  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })
  it('Should call LoadUserAccountRepository when LoadFacebookUserApi returns', async () => {
    await sut.perform({ token })
    expect(loadUserAccountRepository.load).toHaveBeenCalledWith(facebookUserMock)
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })
  it('Should call CreateUserAccountRepository when LoadFacebookUserApi returns undefined', async () => {
    loadUserAccountRepository.load.mockResolvedValue(undefined)
    await sut.perform({ token })
    expect(createUserAccountFromFacebookRepository.createFromFacebook).toHaveBeenCalledWith(facebookUserMock)
    expect(createUserAccountFromFacebookRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
