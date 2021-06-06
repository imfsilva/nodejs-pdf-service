import Pdf, { PdfStatus } from '../models/Pdf'

export interface PdfQuery {
  id?: string
  status: PdfStatus
  limit?: number
}

export interface PdfRepository {
  getPdf(pdf: PdfQuery): Promise<Pdf[]>
  addPdf(data: Pdf): Promise<Pdf>
  updatePdf(pdf: Pdf): Promise<void>
}
