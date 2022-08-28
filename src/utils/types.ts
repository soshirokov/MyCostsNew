export type Costs = {
  [key: string]: string
}

export type CostServer = {
  dateTime: string
  details: {
    [key: string]: string
  }
  total: number
}

export type CostsServer = {
  [key: string]: CostServer
}
