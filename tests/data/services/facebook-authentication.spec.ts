import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  type LoadUserAccountRepository,
  type SaveUserAccountFromFacebookRepository
} from '@/data/contracts/repositories'
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
  let saveUserAccountFromFacebookRepository: MockProxy<SaveUserAccountFromFacebookRepository>
  let sut: FacebookAuthenticationService
  const token = 'any_token'
  const facebookUserMock: LoadFacebookUserApi.FacebookUserData = {
    facebookId: 'any_fb_id',
    name: 'any_fb_name',
    email: 'any_fb_email'
  }
  const userDataMock: LoadUserAccountRepository.userData = {
    userId: 'any_id',
    name: 'any_name',
    email: 'any_email'
  }

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadUserAccountRepository = mock()
    saveUserAccountFromFacebookRepository = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue(facebookUserMock)
    loadUserAccountRepository.load.mockResolvedValue(undefined)
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository,
      saveUserAccountFromFacebookRepository
    )
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
    expect(loadUserAccountRepository.load).toHaveBeenCalledWith(
      facebookUserMock
    )
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })
  it('Should call SaveUserAccountFromFacebookRepository when LoadFacebookUserApi returns undefined', async () => {
    await sut.perform({ token })
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledWith(facebookUserMock)
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledTimes(1)
  })
  it('Should call SaveUserAccountFromFacebookRepository when LoadFacebookUserApi returns data', async () => {
    loadUserAccountRepository.load.mockResolvedValue(userDataMock)
    await sut.perform({ token })
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledWith({
      userId: userDataMock.userId,
      name: userDataMock.name,
      email: facebookUserMock.email,
      facebookId: facebookUserMock.facebookId
    })
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledTimes(1)
  })
  it('Should call SaveUserAccountFromFacebookRepository when LoadFacebookUserApi returns data without name', async () => {
    const { name, ...mockWithNoName } = userDataMock
    loadUserAccountRepository.load.mockResolvedValue(mockWithNoName)
    await sut.perform({ token })
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledWith({
      userId: userDataMock.userId,
      name: facebookUserMock.name,
      email: facebookUserMock.email,
      facebookId: facebookUserMock.facebookId
    })
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledTimes(1)
  })
})
