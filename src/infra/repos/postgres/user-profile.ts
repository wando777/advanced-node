import { type SaveUserPicture, type LoadUserProfile } from '@/domain/contracts/repositories'
import { getRepository } from 'typeorm'
import { PgUser } from './entities'

export class PgUserProfileRepository implements SaveUserPicture, LoadUserProfile {
  async savePicture({ id, pictureUrl, initials }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepo = getRepository(PgUser)
    await pgUserRepo.update({ userId: parseInt(id) }, { pictureUrl, initials })
  }

  async load({ id }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
    const pgUserRepo = getRepository(PgUser)
    const userProfile = await pgUserRepo.findOne({ userId: parseInt(id) })
    return userProfile
  }
}
