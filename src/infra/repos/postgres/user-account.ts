/* eslint-disable @typescript-eslint/indent */
import {
  type SaveUserAccountFromFacebookRepository,
  type LoadUserAccountRepository
} from '@/domain/contracts/repositories'
import { PgUser } from './entities'
import { PgRepository } from './repository'

type SaveParams = SaveUserAccountFromFacebookRepository.Input
type SaveResult = SaveUserAccountFromFacebookRepository.NewUserId

export class PgUserAccountRepository extends PgRepository
  implements LoadUserAccountRepository, SaveUserAccountFromFacebookRepository {
  async saveWithFacebook(input: SaveParams): Promise<SaveResult> {
    const pgUserRepo = this.getRepository(PgUser)
    let userId: string
    if (input.userId === undefined) {
      const pgUser = await pgUserRepo.save({
        email: input.email,
        name: input.name,
        facebookId: input.facebookId
      })
      userId = pgUser.userId.toString()
    } else {
      await pgUserRepo.update(parseInt(input.userId), {
        name: input.name,
        facebookId: input.facebookId
      })
      userId = input.userId
    }
    return { userId }
  }

  async load(
    input: LoadUserAccountRepository.Input
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = this.getRepository(PgUser)
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
