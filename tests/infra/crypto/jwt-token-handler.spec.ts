import { JwtTokenHandler } from '@/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let jwtParams: any
  let fakeJwt: jest.Mocked<typeof jwt>
  let validTokenMock: string

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    jwtParams = { key: 'any_key', secret: 'any_secret' }
    validTokenMock = 'any_valid_token'
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(jwtParams.secret)
  })

  describe('generateToken', () => {
    beforeAll(() => {
      fakeJwt.sign.mockImplementation(() => validTokenMock)
    })

    it('Should call sign with correct params', async () => {
      await sut.generateToken({ key: jwtParams.key, expirationInMs: 3000 })

      expect(fakeJwt.sign).toHaveBeenCalledWith(
        { key: jwtParams.key },
        'any_secret',
        { expiresIn: 3 }
      )
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
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

  describe('validateToken', () => {
    it('Should call validate with correct params', async () => {
      await sut.validateToken({ token: validTokenMock })

      expect(fakeJwt.verify).toHaveBeenCalledWith(validTokenMock, jwtParams.secret)
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
    })
  })
})
