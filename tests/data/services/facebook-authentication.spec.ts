import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  type UpdateUserAccountFromFacebookRepository,
  type CreateUserAccountFromFacebookRepository,
  type LoadUserAccountRepository
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
  let createUserAccountFromFacebookRepository: MockProxy<CreateUserAccountFromFacebookRepository>
  let updateUserAccountFromFacebookRepository: MockProxy<UpdateUserAccountFromFacebookRepository>
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
    createUserAccountFromFacebookRepository = mock()
    updateUserAccountFromFacebookRepository = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue(facebookUserMock)
    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository,
      createUserAccountFromFacebookRepository,
      updateUserAccountFromFacebookRepository
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
  it('Should call CreateUserAccountFromFacebookRepository when LoadFacebookUserApi returns undefined', async () => {
    loadUserAccountRepository.load.mockResolvedValue(undefined)
    await sut.perform({ token })
    expect(
      createUserAccountFromFacebookRepository.createFromFacebook
    ).toHaveBeenCalledWith(facebookUserMock)
    expect(
      createUserAccountFromFacebookRepository.createFromFacebook
    ).toHaveBeenCalledTimes(1)
  })
  it('Should call UpdateUserAccountFromFacebookRepository when LoadFacebookUserApi returns data', async () => {
    loadUserAccountRepository.load.mockResolvedValue(userDataMock)
    await sut.perform({ token })
    expect(
      updateUserAccountFromFacebookRepository.updateWithFacebook
    ).toHaveBeenCalledWith({
      userId: userDataMock.userId,
      name: userDataMock.name,
      facebookId: facebookUserMock.facebookId
    })
    expect(
      updateUserAccountFromFacebookRepository.updateWithFacebook
    ).toHaveBeenCalledTimes(1)
  })
})
