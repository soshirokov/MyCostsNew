import moment from 'moment'
import React from 'react'
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import { currentCurrency } from '../../Store/Currency/selectors'
import { currencyDisplay } from '../../utils/costConverters'
import { getEndOfMonth, getStartOfMonth } from '../../utils/helpers'
import { CostsServer } from '../../utils/types'

type Props = {
  costs: CostsServer
  costLevel: number
}

const AccumulationLineChart = ({ costs, costLevel }: Props) => {
  const costsData = []

  const currency = useSelector(currentCurrency)

  const costsKeysSorted = Object.keys(costs).sort((a, b) =>
    costs[a].dateTime > costs[b].dateTime ? 1 : -1
  )
  costsData.push(...costsKeysSorted.map((key) => +costs[key].total))

  const lastDayOfMonth = getEndOfMonth(moment()).date()
  const firstDayOfMonth = getStartOfMonth(moment())
  const averageCost = costLevel / lastDayOfMonth
  const forecastCosts = new Array(lastDayOfMonth)
    .fill(0)
    .map((item, index) => Math.floor(averageCost * (index + 1)))
  const costsSeries = new Array(lastDayOfMonth)
    .fill(0)
    .map((item, index) =>
      index === 0
        ? firstDayOfMonth.format('DD-MM-YYYY')
        : firstDayOfMonth.add(1, 'days').format('DD-MM-YYYY')
    )
  const accumulationCostData: number[] = []
  costsData.forEach((cost, index) =>
    index === 0
      ? accumulationCostData.push(cost)
      : accumulationCostData.push(cost + accumulationCostData[index - 1])
  )

  const settings = {
    options: {
      xaxis: {
        categories: costsSeries,
      },
      stroke: {
        width: 2,
      },
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (val: number) => currencyDisplay(+val, currency),
        },
      },
      colors: ['#4f5c69', '#25E0A5'],
    },
    series: [
      {
        name: 'Расходы',
        data: accumulationCostData,
      },
      {
        name: 'План',
        data: forecastCosts,
      },
    ],
  }

  return (
    <>
      <Chart
        type="area"
        width="100%"
        height="350px"
        options={settings.options}
        series={settings.series}
      />
    </>
  )
}

export { AccumulationLineChart }
