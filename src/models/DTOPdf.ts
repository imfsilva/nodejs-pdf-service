interface DTOPdfParams {
  id: string
  data: string
  created_at: Date
}

export default class DTOPdf {
  #id: string
  #data: string

  constructor(p: DTOPdfParams) {
    this.#id = p.id
    this.#data = p.data
  }

  get id(): string {
    return this.#id
  }

  set id(v: string) {
    this.#id = v
  }

  get data(): string {
    return this.#data
  }
}
