import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type TokenGenerator } from '@/data/contracts/crypto'
import {
  type LoadUserAccountRepository,
  type SaveUserAccountFromFacebookRepository
} from '@/data/contracts/repositories'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'

import { mocked } from 'jest-mock'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account-model')

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let saveUserAccountFromFacebookRepository: MockProxy<SaveUserAccountFromFacebookRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthenticationService
  const token = 'any_token'
  const facebookUserMock: LoadFacebookUserApi.FacebookUserData = {
    facebookId: 'any_fb_id',
    name: 'any_fb_name',
    email: 'any_fb_email'
  }
  const newUserIdMock: SaveUserAccountFromFacebookRepository.NewUserId = {
    userId: 'any_userId'
  }

  beforeEach(() => {
    loadFacebookUserApi = mock()
    loadUserAccountRepository = mock()
    saveUserAccountFromFacebookRepository = mock()
    crypto = mock()

    crypto.generateToken.mockResolvedValue({ value: 'any_generated_token' })
    loadFacebookUserApi.loadUser.mockResolvedValue(facebookUserMock)
    loadUserAccountRepository.load.mockResolvedValue(undefined)
    saveUserAccountFromFacebookRepository.saveWithFacebook.mockResolvedValue(
      newUserIdMock
    )

    sut = new FacebookAuthenticationService(
      loadFacebookUserApi,
      loadUserAccountRepository,
      saveUserAccountFromFacebookRepository,
      crypto
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
  it('Should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: newUserIdMock.userId,
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })
  it('Should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })
})
