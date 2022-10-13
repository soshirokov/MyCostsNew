export type Costs = {
  [key: string]: number
}

export type CostServer = {
  dateTime: string
  details: {
    [key: string]: number
  }
  total: number
}

export type CostsServer = {
  [key: string]: CostServer
}

export type Categories = Array<string>

export type details = {
  [key: string]: string
}
