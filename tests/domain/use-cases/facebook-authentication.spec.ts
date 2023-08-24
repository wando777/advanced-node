import { type LoadFacebookUserApi } from '@/domain/contracts/apis'
import { type TokenGenerator } from '@/domain/contracts/crypto'
import {
  type LoadUserAccountRepository,
  type SaveUserAccountFromFacebookRepository
} from '@/domain/contracts/repositories'
import { FacebookAuthenticationUseCase } from '@/domain/use-cases'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'

import { mocked } from 'jest-mock'
import { mock, type MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/facebook-account-model')

describe('FacebookAuthenticationUseCase', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let saveUserAccountFromFacebookRepository: MockProxy<SaveUserAccountFromFacebookRepository>
  let crypto: MockProxy<TokenGenerator>
  let sut: FacebookAuthenticationUseCase
  let token: string
  let facebookUserMock: LoadFacebookUserApi.FacebookUserData
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

    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue(facebookUserMock)

    loadUserAccountRepository = mock()
    loadUserAccountRepository.load.mockResolvedValue(undefined)

    saveUserAccountFromFacebookRepository = mock()
    saveUserAccountFromFacebookRepository.saveWithFacebook.mockResolvedValue(
      newUserIdMock
    )

    crypto = mock()
    crypto.generateToken.mockResolvedValue({ value: 'any_generated_token' })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new FacebookAuthenticationUseCase(
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
  // Exception use cases testing
  it('Should rethrow if LoadFacebookUserApi throws', async () => {
    loadFacebookUserApi.loadUser.mockRejectedValueOnce(new Error('fbApi_error'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('fbApi_error'))
  })
  it('Should rethrow if loadUserAccountRepository throws', async () => {
    loadUserAccountRepository.load.mockRejectedValueOnce(
      new Error('loadUser_error')
    )
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('loadUser_error'))
  })
  it('Should rethrow if LoadFacebookUserApi throws', async () => {
    saveUserAccountFromFacebookRepository.saveWithFacebook.mockRejectedValueOnce(
      new Error('saveUser_error')
    )
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('saveUser_error'))
  })
  it('Should rethrow if crypto throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('generateToken_error'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('generateToken_error'))
  })
})
