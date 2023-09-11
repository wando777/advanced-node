import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/infra/repos/postgres/mocks/make-fake-db'
import { UnauthorizedError } from '@/application/errors'
import { app } from '@/main/config/app'
import { type IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import request from 'supertest'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let backupDb: IBackup
    const loadUserSpy = jest.fn()
    jest.mock('@/infra/gateways/facebook-api', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      backupDb = db.backup()
    })
    beforeEach(() => {
      backupDb.restore() // this restore my DB to the very begining, thus, cleaning it all. This helps me avoiding interfering tests with each other
    })
    afterAll(async () => {
      await getConnection().close()
    })
    it('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_email' })
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body).toBeDefined()
    })
    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
