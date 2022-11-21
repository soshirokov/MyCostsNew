export type Costs = {
  [key: string]: number | string
}

export type CostServer = {
  dateTime: string
  details: Costs
  total: number
}

export type CostsServer = {
  [key: string]: CostServer
}

export type Categories = Array<string>

export type details = {
  [key: string]: string
}
