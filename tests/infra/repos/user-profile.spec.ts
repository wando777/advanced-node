import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/infra/repos/postgres/mocks/make-fake-db'
import { PgUserProfileRepository } from '@/infra/repos/postgres'
import { type IBackup } from 'pg-mem'
import { type Repository, getRepository, getConnection } from 'typeorm'

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository
  let pgUserRepo: Repository<PgUser>
  let backupDb: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    pgUserRepo = getRepository(PgUser)
    backupDb = db.backup()
  })
  beforeEach(() => {
    jest.clearAllMocks()
    backupDb.restore() // this restore my DB to the very begining, thus, cleaning it all. This helps me avoiding interfering tests with each other
    sut = new PgUserProfileRepository()
  })
  afterAll(async () => {
    await getConnection().close()
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
  describe('loadPicture', () => {
    it('should load user profile', async () => {
      const { userId } = await pgUserRepo.save({ email: 'any_email', initials: 'any_initials' })

      await sut.savePicture({
        id: userId.toString(),
        pictureUrl: 'any_url'
      })
      const pgUser = await pgUserRepo.findOne({ userId })

      expect(pgUser).toMatchObject({ userId, pictureUrl: 'any_url', initials: null })
    })
  })
})
