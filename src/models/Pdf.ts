interface PdfParams {
  id: string
  status: PdfStatus
  data: string
  created_at: Date
}

export enum PdfStatus {
  created = 1,
  ready,
  error,
}

export default class Pdf {
  #id: string
  #status: PdfStatus
  #data: string
  #created_at: Date

  constructor(p: PdfParams) {
    this.#id = p.id
    this.#status = p.status
    this.#data = p.data
    this.#created_at = p.created_at
  }

  get id(): string {
    return this.#id
  }

  set id(v: string) {
    this.#id = v
  }

  get status(): PdfStatus {
    return this.#status
  }

  set status(s: PdfStatus) {
    this.#status = s
  }

  get data(): string {
    return this.#data
  }

  get created_at(): Date {
    return this.#created_at
  }
}
