import { type ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { makeFileStorage, makeUUIDHandler } from '../../infra/gateways'
import { makePgUserProfileRepo } from '../../infra/repos/postgres'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(
    makeFileStorage(),
    makeUUIDHandler(),
    makePgUserProfileRepo()
  )
}
