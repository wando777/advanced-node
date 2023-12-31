import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from './postgres/mocks/make-fake-db'
import { PgUserProfileRepository } from '@/infra/repos/postgres'
import { type IBackup } from 'pg-mem'
import { type Repository } from 'typeorm'
import { PgRepository } from '@/infra/repos/postgres/repository'
import { PgConnection } from '@/infra/repos/postgres/helpers'

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository
  let pgUserRepo: Repository<PgUser>
  let backupDb: IBackup
  let connection: PgConnection

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDb([PgUser])
    pgUserRepo = connection.getRepository(PgUser)
    backupDb = db.backup()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    backupDb.restore() // this restore my DB to the very begining, thus, cleaning it all. This helps me avoiding interfering tests with each other
    sut = new PgUserProfileRepository()
  })
  afterAll(async () => {
    await connection.disconnect()
  })

  it('should extend PgRepository', async () => {
    expect(sut).toBeInstanceOf(PgRepository)
  })

  describe('savePicture', () => {
    it('should update user profile', async () => {
      const { userId } = await pgUserRepo.save({ email: 'any_email', initials: 'any_initials' })

      await sut.savePicture({
        id: userId.toString(),
        pictureUrl: 'any_url'
      })
      const pgUser = await pgUserRepo.findOne({ userId })

      expect(pgUser).toMatchObject({ userId, pictureUrl: 'any_url', initials: null })
    })
  })
  describe('load', () => {
    it('should load user profile', async () => {
      const { userId } = await pgUserRepo.save({ email: 'any_email', name: 'any_name' })

      const user = await sut.load({ id: userId.toString() })

      expect(user?.name).toBe('any_name')
    })
    it('should return undefined if user does not exist', async () => {
      const user = await sut.load({ id: '1' })

      expect(user).toBeUndefined()
    })
  })
})
