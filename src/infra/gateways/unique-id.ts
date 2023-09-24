import { type UUIDGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements UUIDGenerator {
  generate({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const date = new Date()
    const uniqueId = `${key}_${date.getTime()}`
    return uniqueId
  }
}
