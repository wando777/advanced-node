import { UUIDHandler, UniqueId } from '@/infra/gateways'

export const makeUUIDHandler = (): UUIDHandler => {
  return new UUIDHandler()
}

export const makeUniqyeId = (): UniqueId => {
  return new UniqueId()
}
