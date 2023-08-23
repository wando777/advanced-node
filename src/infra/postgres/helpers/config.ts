import { type ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'silly.db.elephantsql.com',
  port: 5432,
  username: 'tlggfkji',
  password: 'JLUim1PUZkW7uc0QxV9EzuIeAhUKjQPD',
  database: 'tlggfkji',
  entities: ['dist/infra/postgres/entities/index.js']
}
