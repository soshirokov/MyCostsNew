import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import { currentCurrency } from '../../Store/Currency/selectors'
import { currencyDisplay } from '../../utils/costConverters'
import { CostsServer } from '../../utils/types'
import { Radio } from 'antd'
import { useState } from 'react'

type Props = {
  costs: CostsServer
  withTypeSwitcher?: boolean
  isVisible?: boolean
}

type CostsTotal = {
  [key: string]: {
    dateTime: string
    total: number
  }
}

const StatsLineChart = ({
  costs,
  withTypeSwitcher,
  isVisible = true,
}: Props) => {
  const [type, setType] = useState<'day' | 'month'>('day')

  const options = [
    { label: 'По дням', value: 'day' },
    { label: 'По месяцам', value: 'month' },
  ]

  const costsData = []
  const costsSeries = []

  const currency = useSelector(currentCurrency)

  const clearedCosts: CostsTotal = Object.keys(costs).reduce(
    (acc: CostsTotal, key) => ({
      ...acc,
      [key]: {
        dateTime: costs[key].dateTime,
        total: costs[key].total,
      },
    }),
    {}
  )

  const groupedCosts: CostsTotal =
    type === 'day'
      ? clearedCosts
      : Object.keys(clearedCosts).reduce((acc: CostsTotal, key) => {
          const monthKey = [key.split('-')[1], key.split('-')[2]].join('-')

          return monthKey in acc
            ? {
                ...acc,
                [monthKey]: {
                  ...acc[monthKey],
                  total: acc[monthKey].total + clearedCosts[key].total,
                },
              }
            : {
                ...acc,
                [monthKey]: {
                  ...clearedCosts[key],
                },
              }
        }, {})

  const costsKeysSorted = Object.keys(groupedCosts).sort((a, b) =>
    groupedCosts[a].dateTime > groupedCosts[b].dateTime ? 1 : -1
  )
  costsData.push(...costsKeysSorted.map((key) => +groupedCosts[key].total))
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

  if (!isVisible) {
    return null
  }

  return (
    <>
      {withTypeSwitcher && (
        <Radio.Group
          options={options}
          onChange={(e) => {
            setType(e.target.value)
          }}
          value={type}
          optionType="button"
          size="middle"
        />
      )}
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
