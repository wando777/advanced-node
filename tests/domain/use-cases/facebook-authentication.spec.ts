import { type LoadFacebookUser, type TokenGenerator } from '@/domain/contracts/gateways'
import {
  type LoadUserAccountRepository,
  type SaveUserAccountFromFacebookRepository
} from '@/domain/contracts/repositories'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { type FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'

import { mocked } from 'jest-mock'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/facebook-account-model')

describe('FacebookAuthentication', () => {
  let LoadFacebookUser: MockProxy<LoadFacebookUser>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let saveUserAccountFromFacebookRepository: MockProxy<SaveUserAccountFromFacebookRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthentication
  let token: string
  let facebookUserMock: LoadFacebookUser.FacebookUserData
  let newUserIdMock: SaveUserAccountFromFacebookRepository.NewUserId

  beforeAll(() => {
    token = 'any_token'
    facebookUserMock = {
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    }
    newUserIdMock = {
      userId: 'any_userId'
    }

    LoadFacebookUser = mock()
    LoadFacebookUser.loadUser.mockResolvedValue(facebookUserMock)

    loadUserAccountRepository = mock()
    loadUserAccountRepository.load.mockResolvedValue(undefined)

    saveUserAccountFromFacebookRepository = mock()
    saveUserAccountFromFacebookRepository.saveWithFacebook.mockResolvedValue(
      newUserIdMock
    )

    crypto = mock()
    crypto.generate.mockResolvedValue({ value: 'any_generated_token' })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = setupFacebookAuthentication(
      LoadFacebookUser,
      loadUserAccountRepository,
      saveUserAccountFromFacebookRepository,
      crypto
    )
  })

  it('Should call LoadFacebookUser with correct parameter', async () => {
    await sut({ token })

    expect(LoadFacebookUser.loadUser).toHaveBeenCalledWith({ token })
    expect(LoadFacebookUser.loadUser).toHaveBeenCalledTimes(1)
  })
  it('Should throw AuthenticationError when LoadFacebookUser returns undefined', async () => {
    LoadFacebookUser.loadUser.mockResolvedValueOnce(undefined)

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })
  it('Should call LoadUserAccountRepository when LoadFacebookUser returns data', async () => {
    await sut({ token })
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
    await sut({ token })
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledWith({ any: 'any' })
    expect(
      saveUserAccountFromFacebookRepository.saveWithFacebook
    ).toHaveBeenCalledTimes(1)
  })
  it('Should call TokenGenerator with correct params', async () => {
    await sut({ token })
    expect(crypto.generate).toHaveBeenCalledWith({
      key: newUserIdMock.userId,
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generate).toHaveBeenCalledTimes(1)
  })
  it('Should return an AccessToken on success', async () => {
    const authResult = await sut({ token })
    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
  })
  // Exception use cases testing
  it('Should rethrow if LoadFacebookUser throws', async () => {
    LoadFacebookUser.loadUser.mockRejectedValueOnce(new Error('fbApi_error'))
    const promise = sut({ token })
    await expect(promise).rejects.toThrow(new Error('fbApi_error'))
  })
  it('Should rethrow if loadUserAccountRepository throws', async () => {
    loadUserAccountRepository.load.mockRejectedValueOnce(
      new Error('loadUser_error')
    )
    const promise = sut({ token })
    await expect(promise).rejects.toThrow(new Error('loadUser_error'))
  })
  it('Should rethrow if LoadFacebookUser throws', async () => {
    saveUserAccountFromFacebookRepository.saveWithFacebook.mockRejectedValueOnce(
      new Error('saveUser_error')
    )
    const promise = sut({ token })
    await expect(promise).rejects.toThrow(new Error('saveUser_error'))
  })
  it('Should rethrow if crypto throws', async () => {
    crypto.generate.mockRejectedValueOnce(new Error('generate_error'))
    const promise = sut({ token })
    await expect(promise).rejects.toThrow(new Error('generate_error'))
  })
})
