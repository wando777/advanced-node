import {
  type SaveUserAccountFromFacebookRepository,
  type LoadUserAccountRepository
} from '@/data/contracts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

export class PgUserAccountRepository
implements LoadUserAccountRepository, SaveUserAccountFromFacebookRepository {
  async saveWithFacebook(
    input: SaveUserAccountFromFacebookRepository.Input
  ): Promise<SaveUserAccountFromFacebookRepository.NewUserId> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.save({ email: input.email, name: input.name, facebookId: input.facebookId })
    return await new Promise((resolve, reject) => {
      resolve({ userId: '123' })
    })
  }

  async load(
    input: LoadUserAccountRepository.Input
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ email: input.email })

    if (pgUser !== undefined && pgUser !== null) {
      return {
        userId: pgUser.userId.toString(),
        name: pgUser.name ?? undefined // ...(pgUser.name !== null && { name: pgUser.name })
      }
    }
    // eslint-disable-next-line @typescript-eslint/return-await
    return new Promise((resolve, reject) => {
      resolve(undefined)
    })
  }
}
