import { type LoadUserAccountRepository } from '@/data/contracts/repositories'
import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm'
import { newDb } from 'pg-mem'

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: LoadUserAccountRepository
    let userDataMock: LoadUserAccountRepository.UserData
    beforeAll(() => {
      userDataMock = {
        email: 'any_email@email.com',
        userId: 'any_user_id',
        name: 'any_name'
      }
    })
    beforeEach(() => {
      sut = new PgUserAccountRepository()
    })
    it('should return an account if email exists', async () => {
      const db = newDb()
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser]
      })

      await connection.synchronize()
      const pgUserRepo = getRepository(PgUser)
      await pgUserRepo.save({ email: userDataMock.email })
      const account = await sut.load({ email: userDataMock.email ?? '' })
      expect(account).toEqual({ userId: '1' })
    })
  })
  describe('saveWithFacebook', () => {
    it('should return an account if email exists', () => {})
  })
})

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(
    input: LoadUserAccountRepository.Input
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email: input.email })

    if (pgUser !== undefined && pgUser !== null) {
      return {
        userId: pgUser.id.toString(),
        name: pgUser.name ?? undefined // ...(pgUser.name !== null && { name: pgUser.name })
      }
    }
    // eslint-disable-next-line @typescript-eslint/return-await
    return new Promise((resolve, reject) => {
      resolve(undefined)
    })
  }
}

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ name: 'nome', nullable: true })
    name?: string

  @Column()
    email!: string

  @Column({ name: 'id_facebook', nullable: true })
    facebookId?: string
}
