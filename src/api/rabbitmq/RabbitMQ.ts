import amqplib, { Channel, Connection, Options } from 'amqplib'
import { Saver } from '../../saver/Saver'
import { Log } from '../../config/logger'
import { Stopper } from '../../Stopper'
import DTOPdf from '../../models/DTOPdf'

interface AMPQSettings extends Options.Connect {
  pdfQueueName: string
}

export class RabbitMQ implements Stopper {
  readonly #log: Log
  readonly #svr: Saver
  #conn: Connection

  constructor(log: Log, svr: Saver) {
    this.#log = log
    this.#svr = svr
    const config = this.config()

    this.init(config)
  }

  stop(): void {
    this.#conn.close()
  }

  private async init(config: AMPQSettings): Promise<void> {
    try {
      this.#conn = await amqplib.connect(config)
      const ch = await this.#conn.createChannel()
      await this.startQueues(ch, config)
    } catch (e) {
      this.#log.error(e.message, e)
    }
  }

  private async startQueues(ch: Channel, config: AMPQSettings): Promise<void> {
    try {
      await this.startPdfQueue(ch, config)
    } catch (e) {
      this.#log.error(e.message, e)
    }
  }

  private async startPdfQueue(ch: Channel, config: AMPQSettings): Promise<void> {
    await ch.assertQueue(config.pdfQueueName, { durable: true })
    await ch.consume(config.pdfQueueName, async (msg) => {
      try {
        const dto = JSON.parse(msg?.content.toString('utf8') as string)
        await this.#svr.savePdf(dto as DTOPdf)
        ch.ack(msg!)
      } catch (e) {
        this.#log.error(e.message, e)
      }
    })
  }

  private config(): AMPQSettings {
    return {
      pdfQueueName: process.env.RABBIT_PDF_QUEUE || '',
      hostname: process.env.RABBIT_HOST,
      port: parseInt(process.env.RABBIT_PORT || '5672'),
      username: process.env.RABBIT_USER,
      password: process.env.RABBIT_PASSWORD,
    }
  }
}
