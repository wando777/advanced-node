import { type UUIDGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements UUIDGenerator {
  constructor(private readonly date: Date) { }
  generate({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const uniqueId = `${key}_${this.date.getTime()}`
    return uniqueId
  }
}
