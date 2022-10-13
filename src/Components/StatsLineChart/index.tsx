import React from 'react'
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import { currentCurrency } from '../../Store/Currency/selectors'
import { currencyDisplay } from '../../utils/costConverters'
import { CostsServer } from '../../utils/types'

type Props = {
  costs: CostsServer
}

const StatsLineChart = ({ costs }: Props) => {
  const costsData = []
  const costsSeries = []

  const currency = useSelector(currentCurrency)

  const costsKeysSorted = Object.keys(costs).sort((a, b) =>
    costs[a].dateTime > costs[b].dateTime ? 1 : -1
  )
  costsData.push(...costsKeysSorted.map((key) => +costs[key].total))
  costsSeries.push(...costsKeysSorted)

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
      colors: ['#4f5c69'],
    },
    series: [
      {
        name: 'Расходы',
        data: costsData,
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

export { StatsLineChart }
