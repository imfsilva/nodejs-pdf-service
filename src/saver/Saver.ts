import DTOPdf from '../models/DTOPdf'

export interface Saver {
  savePdf(pdf: DTOPdf): Promise<void>
}
