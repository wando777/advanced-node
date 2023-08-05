import { JwtTokenGenerator } from '@/data/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let jwtParams: any
  let fakeJwt: jest.Mocked<typeof jwt>
  let validTokenMock: string

  beforeAll(() => {
    jwtParams = { key: 'any_key', secret: 'any_secret' }
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    validTokenMock = 'any_valid_token'
    fakeJwt.sign.mockImplementation(() => validTokenMock)
  })

  beforeEach(() => {
    sut = new JwtTokenGenerator(jwtParams.secret)
  })

  it('Should call sign with correct params', async () => {
    await sut.generateToken({ key: jwtParams.key, expirationInMs: 3000 })

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      { key: jwtParams.key },
      'any_secret',
      { expiresIn: 3 }
    )
  })
  it('Should return a valid token on success', async () => {
    const token = await sut.generateToken({
      key: jwtParams.key,
      expirationInMs: 3000
    })

    expect(token).toEqual({ value: validTokenMock })
  })
  it('Should rethrown if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('token_generator_error')
    })
    const promise = sut.generateToken({
      key: jwtParams.key,
      expirationInMs: 3000
    })
    await expect(promise).rejects.toThrow(new Error('token_generator_error'))
  })
})
