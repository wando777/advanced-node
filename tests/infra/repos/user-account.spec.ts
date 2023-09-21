import { PgUserAccountRepository } from '@/infra/repos/postgres'
import { PgUser } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from './postgres/mocks/make-fake-db'
import { type IBackup } from 'pg-mem'
import { type Repository, getRepository, getConnection } from 'typeorm'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let backupDb: IBackup
  let userDataMock: any

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser])
    pgUserRepo = getRepository(PgUser)
    backupDb = db.backup()
    userDataMock = {
      email: 'any_email@email.com',
      userId: 'any_user_id',
      name: 'any_name',
      facebookId: 'any_facebookId'
    }
  })
  beforeEach(() => {
    backupDb.restore() // this restore my DB to the very begining, thus, cleaning it all. This helps me avoiding interfering tests with each other
    sut = new PgUserAccountRepository()
  })
  afterAll(async () => {
    await getConnection().close()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: userDataMock.email })
      const account = await sut.load({ email: userDataMock.email })
      expect(account).toEqual({ userId: '1' })
    })
    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: userDataMock.email })

      expect(account).toEqual(undefined)
    })
  })

  describe('saveWithFacebook', () => {
    it('should create an account if userId is undefined', async () => {
      const { userId, ...newUserDataMock } = userDataMock
      const newUserId = await sut.saveWithFacebook(newUserDataMock)
      const pgUser = await pgUserRepo.findOne({ email: userDataMock.email })
      expect(pgUser?.userId).toBe(1)
      expect(newUserId).toEqual({ userId: '1' })
    })
    it('should update an account when userId is given', async () => {
      const { userId, ...newUserDataMock } = userDataMock
      const newUser = {
        email: 'any_new_email@email.com',
        userId: '1',
        name: 'any_new_name',
        facebookId: 'any_new_facebookId'
      }
      await pgUserRepo.save(newUserDataMock)
      const account = await sut.saveWithFacebook(newUser)
      const pgUser = await pgUserRepo.findOne({ email: userDataMock.email })
      expect(pgUser).toMatchObject({
        email: 'any_email@email.com',
        userId: 1,
        name: 'any_new_name',
        facebookId: 'any_new_facebookId'
      })
      expect(account).toEqual({ userId: newUser.userId })
    })
  })
})
