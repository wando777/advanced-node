import { type SaveUserPicture, type LoadUserProfile } from '@/domain/contracts/repositories'
import { PgUser } from './entities'
import { PgRepository } from './repository'

export class PgUserProfileRepository extends PgRepository
  implements SaveUserPicture, LoadUserProfile {
  async savePicture({ id, pictureUrl, initials }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepo = this.getRepository(PgUser)
    await pgUserRepo.update({ userId: parseInt(id) }, { pictureUrl, initials })
  }

  async load({ id }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
    const pgUserRepo = this.getRepository(PgUser)
    const userProfile = await pgUserRepo.findOne({ userId: parseInt(id) })
    return userProfile
  }
}
