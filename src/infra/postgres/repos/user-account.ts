/* eslint-disable @typescript-eslint/indent */
import {
  type SaveUserAccountFromFacebookRepository,
  type LoadUserAccountRepository
} from '@/data/contracts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from '../entities'

type SaveParams = SaveUserAccountFromFacebookRepository.Input
type SaveResult = SaveUserAccountFromFacebookRepository.NewUserId

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveUserAccountFromFacebookRepository
{
  private readonly pgUserRepo = getRepository(PgUser)
  async saveWithFacebook(input: SaveParams): Promise<SaveResult> {
    let userId: string
    if (input.userId === undefined) {
      const pgUser = await this.pgUserRepo.save({
        email: input.email,
        name: input.name,
        facebookId: input.facebookId
      })
      userId = pgUser.userId.toString()
    } else {
      await this.pgUserRepo.update(parseInt(input.userId), {
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
    const pgUser = await this.pgUserRepo.findOne({ email: input.email })

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
