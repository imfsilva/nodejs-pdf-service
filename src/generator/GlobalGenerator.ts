import { Generator } from './Generator'
import Pdf from 'src/models/Pdf'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface DataItem {
  type: string
  header: string
  description: string
  fields?: string[]
  items: any[]
}

interface PdfData {
  logo: string
  header: string
  description: string
  items: DataItem[]
}

const TABLE_ITEM = 'table'
const MARGIN_LEFT = 15

export class GlobalGenerator implements Generator {
  async generate(pdf: Pdf): Promise<void> {
    const doc: jsPDF = this.createDocument()
    const docWidth: number = doc.internal.pageSize.getWidth()

    const data: PdfData = JSON.parse(pdf.data)

    doc.setFont('Helvetica')

    // logo
    doc.addImage(data.logo, 'JPEG', 85, 75, 45, 25)

    // header
    this.setDocumentTextWidth(doc, 17)
    doc.text(data.header, docWidth / 2, 125, { align: 'center' })

    // description
    this.setDocumentTextWidth(doc, 14)
    const splitDescription = doc.splitTextToSize(data.description, 180)
    doc.text(splitDescription, docWidth / 2, 140, { align: 'center' })

    // items
    const startY = 25
    data.items.forEach((di: DataItem) => {
      doc.addPage()
      if (di.type === TABLE_ITEM && di.fields) {
        doc.text(di.header, MARGIN_LEFT, startY)
        doc.text(di.description, MARGIN_LEFT, startY + 10)
        this.addTable(doc, di.fields, di.items, startY + 20)
      }
    })

    doc.save(`./tmp/${pdf.id}.pdf`)
  }

  private addTable(doc: jsPDF, fields: string[], items: any[], startY: number): void {
    autoTable(doc, {
      head: [fields],
      body: this.formatItems(items),
      startY,
    })
  }

  private formatItems(items: any[]) {
    const itemsFormatted: any[] = []
    items.forEach((item) => {
      itemsFormatted.push(Object.values(item))
    })
    return itemsFormatted
  }

  private setDocumentTextWidth(d: jsPDF, size: number): void {
    d.setFontSize(size)
  }

  private createDocument(): jsPDF {
    return new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    })
  }
}
