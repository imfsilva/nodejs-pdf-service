export interface Http {
  sendPDF(pdfId: string): Promise<void>
}
