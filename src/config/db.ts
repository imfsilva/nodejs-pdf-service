import knex from 'knex'
import { getLogger } from './logger'
import Knex from 'knex'

const log = getLogger()

const db = knex({
  client: process.env.DB_DIALECT,
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  useNullAsDefault: true,
  log: {
    error: log.error,
    warn: log.warning,
    debug: log.debug,
  },
})

export function getDB(): Knex {
  return db
}
