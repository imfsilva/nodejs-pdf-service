import Knex, { QueryBuilder } from 'knex'
import { PdfQuery, PdfRepository } from './PdfRepository'
import Pdf from '../models/Pdf'
import { v4 } from 'uuid'

const TABLE_PDFS = 'pdfs'
const DEFAULT_LIMIT = 20

export class PGPdfRepository implements PdfRepository {
  readonly #db: Knex

  constructor(db: Knex) {
    this.#db = db
  }

  async getPdf(q: PdfQuery): Promise<Pdf[]> {
    const qb = this.#db(TABLE_PDFS).select('*')
    if (q.id) {
      return this.createPdfFromRows(await qb.where('id', q.id).limit(1))
    } else {
      return this.createPdfFromRows(await this.pdfQuery(qb, q).limit(q.limit || DEFAULT_LIMIT))
    }
  }

  async updatePdf(p: Pdf): Promise<void> {
    await this.#db(TABLE_PDFS).update(this.parsePDFsForDB(p)).where({ id: p.id })
  }

  async addPdf(p: Pdf): Promise<Pdf> {
    p.id = (await this.#db(TABLE_PDFS).insert(this.parsePDFsForDB(p), 'id'))[0]
    return p
  }

  private pdfQuery(qb: QueryBuilder, q: PdfQuery): QueryBuilder {
    qb.where({ status: q.status })
    return qb
  }

  private createPdfFromRows(rows: any[]): Pdf[] {
    return rows.map(
      (r) =>
        new Pdf({
          id: r.id,
          status: r.status,
          created_at: r.created_at,
          data: r.data,
        }),
    )
  }

  private parsePDFsForDB(p: Pdf): Record<string, any> {
    return {
      id: p.id || v4(),
      status: p.status,
      data: p.data,
      created_at: p.created_at,
    }
  }
}
