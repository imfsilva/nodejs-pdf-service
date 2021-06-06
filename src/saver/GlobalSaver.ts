import { Log } from '../config/logger'
import { Saver } from './Saver'
import { PdfRepository } from '../repository/PdfRepository'
import DTOPdf from '../models/DTOPdf'
import Pdf, { PdfStatus } from '../models/Pdf'

export class GlobalSaver implements Saver {
  readonly #log: Log
  readonly #pr: PdfRepository

  constructor(log: Log, pr: PdfRepository) {
    this.#log = log
    this.#pr = pr
  }

  async savePdf(dto: DTOPdf): Promise<void> {
    try {
      const pdf = await this.#pr.addPdf(this.pdfFromDTO(dto))
      this.#log.info(`PDF with ID: ${pdf.id} was saved`)
    } catch (e) {
      this.#log.error(e.message, e)
    }
  }

  private pdfFromDTO(dto: DTOPdf): Pdf {
    return new Pdf({
      id: dto.id,
      data: dto.data,
      created_at: new Date(),
      status: PdfStatus.created,
    })
  }
}
