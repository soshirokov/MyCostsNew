import { Costs, CostsServer } from './types'

export const convertToRate = (rate: number, costs: Costs) => {
  const newCosts = { ...costs }

  Object.keys(newCosts).forEach((key) => {
    newCosts[key] = Math.round(+newCosts[key] * rate)
  })

  return newCosts
}

export const convertFromRate = (rate: number, costs: Costs) => {
  const newCosts = { ...costs }

  Object.keys(newCosts).forEach((key) => {
    newCosts[key] = Math.round(+newCosts[key] / rate)
  })

  return newCosts
}

export const convertAllToRate = (rate: number, costs: CostsServer) => {
  const newCosts = { ...costs }

  Object.keys(newCosts).forEach((date) => {
    newCosts[date].total = Math.round(newCosts[date].total * rate)

    Object.keys(newCosts[date].details).forEach((category) => {
      newCosts[date].details[category] = Math.round(
        +newCosts[date].details[category] * rate
      )
    })
  })

  return newCosts
}

export const currencyDisplay = (cost: number, currency: string) => {
  return cost.toLocaleString('ru-RU', {
    style: 'currency',
    currency,
  })
}
