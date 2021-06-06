import { getLogger, Log } from './config/logger'
import Knex from 'knex'
import { getDB } from './config/db'
import { GlobalSaver } from './saver/GlobalSaver'
import { RabbitMQ } from './api/rabbitmq/RabbitMQ'
import { Saver } from './saver/Saver'
import { Stopper } from './Stopper'
import { PdfRepository } from './repository/PdfRepository'
import { PGPdfRepository } from './repository/PGPdfRepository'
import { PDFProcessor } from './worker/PDFProcessor'
import { Generator } from './generator/Generator'
import { GlobalGenerator } from './generator/GlobalGenerator'
import { Http } from './http/Http'
import { GlobalHttp } from './http/GlobalHttp'

class Container {
  readonly #logger: Log
  readonly #db: Knex

  readonly #pr: PdfRepository
  readonly #saver: Saver
  readonly #rabbit: RabbitMQ
  readonly #worker: PDFProcessor
  readonly #generator: Generator
  readonly #http: Http

  readonly #stoppers: Stopper[] = []

  constructor(log: Log, db: Knex) {
    this.#logger = log
    this.#db = db

    this.#pr = new PGPdfRepository(db)

    this.#saver = new GlobalSaver(log, this.#pr)
    this.#rabbit = new RabbitMQ(log, this.#saver)
    this.#generator = new GlobalGenerator()
    this.#http = new GlobalHttp(log)

    this.#worker = new PDFProcessor(log, this.#pr, this.#generator, this.#http)

    this.#stoppers.push(this.#rabbit)
  }

  stop() {
    this.#stoppers.forEach((s) => s.stop())
  }
}

export const container = (): Container => new Container(getLogger(), getDB())
