import { Log } from '../config/logger'
import { Stopper } from '../Stopper'
import { PdfRepository } from '../repository/PdfRepository'
import { PdfStatus } from '../models/Pdf'
import { Generator } from '../generator/Generator'
import { Http } from '../http/Http'

const DEFAULT_PAUSE = 1000
const MAX_PAUSE = 60 * 1000

export class PDFProcessor implements Stopper {
  readonly #log: Log
  readonly #pr: PdfRepository
  readonly #generator: Generator
  readonly #http: Http
  #isStarted = false

  constructor(log: Log, pr: PdfRepository, generator: Generator, http: Http) {
    this.#log = log
    this.#pr = pr
    this.#generator = generator
    this.#http = http
    this.start()
  }

  stop(): void {
    this.#isStarted = false
  }

  private async start(): Promise<void> {
    this.#isStarted = true
    let pause = DEFAULT_PAUSE

    while (this.#isStarted) {
      try {
        const pdfs = await this.#pr.getPdf({ status: PdfStatus.created, limit: 1 })
        if (pdfs.length !== 1) {
          await new Promise((resolve) => setTimeout(resolve, pause))
          pause = this.calculatePause(pause)
          continue
        }
        pause = DEFAULT_PAUSE
        const pdf = pdfs[0]
        await this.#generator.generate(pdf)

        pdf.status = PdfStatus.ready
        await this.#pr.updatePdf(pdf)

        // HTTP Request to external API
        await this.#http.sendPDF(pdf.id)
      } catch (e) {
        this.#log.error(e, e)
        await new Promise((resolve) => setTimeout(resolve, pause))
        pause = this.calculatePause(pause)
      }
    }
  }

  private calculatePause(p: number): number {
    return p < MAX_PAUSE / 2 ? 2 * p : p
  }
}
