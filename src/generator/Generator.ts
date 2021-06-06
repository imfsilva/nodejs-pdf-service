import Pdf from '../models/Pdf'

export interface Generator {
  generate(pdf: Pdf): Promise<void>
}
