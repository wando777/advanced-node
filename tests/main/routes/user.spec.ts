import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/infra/repos/postgres/mocks/make-fake-db'
import { app } from '@/main/config/app'
import { type IBackup } from 'pg-mem'
import { type Repository, getConnection, getRepository } from 'typeorm'
import { env } from '@/main/config/env'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

describe('User Routes', () => {
  let backupDb: IBackup
  let pgUserRepo: Repository<PgUser>

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    backupDb = db.backup()
    pgUserRepo = getRepository(PgUser)
  })
  beforeEach(() => {
    jest.clearAllMocks()
    backupDb.restore()
  })
  afterAll(async () => {
    await getConnection().close()
  })
  describe('DELETE /users/picture', () => {
    it('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/picture')

      expect(status).toBe(403)
    })
    it('should return 200', async () => {
      const { userId } = await pgUserRepo.save({ email: 'any_email', name: 'Wando Aragao' })
      const authorization = sign({ key: userId }, env.jwtSecret)

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: undefined, initials: 'WA' })
    })
  })

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn()
    jest.mock('@/infra/gateways/aws-s3-file-storage', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({
        upload: uploadSpy
      })
    }))
    it('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .put('/api/users/picture')

      expect(status).toBe(403)
    })
    it('should return 200', async () => {
      uploadSpy.mockReturnValueOnce('any_url')
      const { userId } = await pgUserRepo.save({ email: 'any_email', name: 'Wando Aragao' })
      const authorization = sign({ key: userId }, env.jwtSecret)

      const { status, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/png' })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined })
    })
  })
})
