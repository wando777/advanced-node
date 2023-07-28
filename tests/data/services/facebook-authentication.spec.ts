import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import {
  type LoadUserAccountRepository,
  type SaveUserAccountFromFacebookRepository
} from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/contracts/services'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'

import { mocked } from 'jest-mock'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account-model')

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
  it('Should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(loadUserAccountRepository.load).toHaveBeenCalledWith(
      facebookUserMock
    )
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })
  it('Should call SaveUserAccountFromFacebookRepository with FacebookAccount', async () => {
    const FacebookAccountStub = jest
      .fn()
      .mockImplementation(() => ({ any: 'any' }))
    mocked(FacebookAccount).mockImplementation(FacebookAccountStub)
    await sut.perform({ token })
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledWith({ any: 'any' })
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledTimes(1)
  })
})
