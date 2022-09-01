export type Costs = {
  [key: string]: string
}

export type CostServer = {
  dateTime: string
  details: {
    [key: string]: string
  }
  total: string | number
}

export type CostsServer = {
  [key: string]: CostServer
}

export type Categories = Array<string>
