import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/infra/repos/postgres/mocks/make-fake-db'
import { app } from '@/main/config/app'
import { type IBackup } from 'pg-mem'
import { getConnection } from 'typeorm'
import request from 'supertest'

describe('User Routes', () => {
  describe('DELETE /users/picture', () => {
    let backupDb: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      backupDb = db.backup()
    })
    beforeEach(() => {
      backupDb.restore()
    })
    afterAll(async () => {
      await getConnection().close()
    })
    // it('should return 200 with AccessToken', async () => {
    //   loadUserSpy.mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_email' })
    //   const { status, body } = await request(app)
    //     .post('/api/login/facebook')
    //     .send({ token: 'valid_token' })

    //   expect(status).toBe(200)
    //   expect(body).toBeDefined()
    // })
    it('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/picture')

      expect(status).toBe(403)
    })
  })
})
