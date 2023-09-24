/* eslint-disable @typescript-eslint/indent */
import { type ObjectLiteral, type ObjectType, type Repository } from 'typeorm'
import { PgConnection } from './helpers'

export abstract class PgRepository {
  constructor(private readonly connection: PgConnection = PgConnection.getInstance()) { }

  getRepository<Entity extends ObjectLiteral>(entity: ObjectType<Entity>): Repository<Entity> {
    return this.connection.getRepository(entity)
  }
}
