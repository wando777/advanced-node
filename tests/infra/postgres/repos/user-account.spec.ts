import { type LoadUserAccountRepository } from '@/data/contracts/repositories'
import { PgUser } from '@/data/infra/postgres/entities'
import { PgUserAccountRepository } from '@/data/infra/postgres/repos'
import { type Repository, getRepository, getConnection } from 'typeorm'
import { type IMemoryDb, newDb, type IBackup } from 'pg-mem'

const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/postgres/entities/index.ts']
  })

  await connection.synchronize()
  return db
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: LoadUserAccountRepository
    let userDataMock: LoadUserAccountRepository.UserData
    let pgUserRepo: Repository<PgUser>
    let backupDb: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser])
      pgUserRepo = getRepository(PgUser)
      backupDb = db.backup()
      userDataMock = {
        email: 'any_email@email.com',
        userId: 'any_user_id',
        name: 'any_name'
      }
    })
    beforeEach(() => {
      backupDb.restore() // this restore my DB to the very begining, thus, cleaning it all. This helps me avoiding interfering tests with each other
      sut = new PgUserAccountRepository()
    })
    afterAll(async () => {
      await getConnection().close()
    })
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: userDataMock.email })
      const account = await sut.load({ email: userDataMock.email ?? '' })
      expect(account).toEqual({ userId: '1' })
    })
    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: userDataMock.email ?? '' })

      expect(account).toEqual(undefined)
    })
  })
  describe('saveWithFacebook', () => {
    it('', () => { })
  })
})
