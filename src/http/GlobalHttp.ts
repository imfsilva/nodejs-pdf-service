import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'
import { Log } from '../config/logger'
import { Http } from './Http'

export class GlobalHttp implements Http {
  readonly #log: Log

  constructor(log: Log) {
    this.#log = log
  }

  async sendPDF(pdfId: string): Promise<void> {
    try {
      const filename: string = `${pdfId}.pdf`
      const b: Buffer = fs.readFileSync(`./tmp/${filename}`)
      const fd = new FormData()

      fd.append('file', b, {
        contentType: 'application/pdf',
        filename,
      })

      await fetch(`${process.env.EXTERNAL_API_URI}/${pdfId}`, {
        method: 'POST',
        body: fd,
      })

      this.deleteFromDisk(pdfId)
    } catch (e) {
      this.#log.error(e.message, e)
    }
  }

  private deleteFromDisk(pdfId: string) {
    fs.unlink(`./tmp/${pdfId}.pdf`, (e) => {
      if (e) {
        this.#log.error(e.message, e)
        return
      }
    })
  }
}
