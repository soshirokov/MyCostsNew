import React from 'react'
import Chart from 'react-apexcharts'
import { CostsServer } from '../../utils/types'

type Props = {
  costs: CostsServer
  categories: Array<string>
}

const PieChart = ({ costs, categories }: Props) => {
  const sortedCosts = categories
    .map((category) => {
      return {
        category,
        total: Object.keys(costs).reduce((total, key) => {
          const costTotal = costs[key].details[category]
            ? +costs[key].details[category]
            : 0
          return total + costTotal
        }, 0),
      }
    })
    .sort((a, b): any => a.total < b.total)

  const settings = {
    chart: {
      width: '100%',
      height: 380,
    },
    options: {
      labels: sortedCosts.map((cost) => cost.category),
      legend: {
        show: false,
      },
      colors: [
        'rgba(63, 42, 255, 1.1)',
        'rgba(63, 42, 255, 0.95)',
        'rgba(63, 42, 255, 0.9)',
        'rgba(63, 42, 255, 0.85)',
        'rgba(63, 42, 255, 0.8)',
        'rgba(63, 42, 255, 0.75)',
        'rgba(63, 42, 255, 0.7)',
        'rgba(63, 42, 255, 0.65)',
        'rgba(63, 42, 255, 0.6)',
        'rgba(63, 42, 255, 0.55)',
        'rgba(63, 42, 255, 0.5)',
        'rgba(63, 42, 255, 0.45)',
        'rgba(63, 42, 255, 0.4)',
        'rgba(63, 42, 255, 0.35)',
        'rgba(63, 42, 255, 0.3)',
        'rgba(63, 42, 255, 0.25)',
      ],
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          startAngle: -140,
          endAngle: 140,
          expandOnClick: false,
          donut: {
            labels: {
              show: true,
              name: {
                color: '#3f2aff',
              },
              value: {
                fontSize: '16px',
                formatter: function (val: String) {
                  return (+val).toLocaleString('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                  })
                },
              },
              total: {
                show: true,
                color: '#000000',
                label: 'Всего за месяц',
                fontSize: '14px',
                fontWeight: 600,
                formatter: function (w: any) {
                  return w.globals.seriesTotals
                    .reduce((a: any, b: any) => {
                      return a + b
                    }, 0)
                    .toLocaleString('ru-RU', {
                      style: 'currency',
                      currency: 'RUB',
                    })
                },
              },
            },
          },
        },
      },
    },
    series: sortedCosts.map((cost) => cost.total),
  }

  return (
    <>
      <Chart type="donut" options={settings.options} series={settings.series} />
    </>
  )
}

export { PieChart }
