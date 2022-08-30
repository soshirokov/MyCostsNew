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
    options: {
      size: 300,
      labels: sortedCosts.map((cost) => cost.category),
      legend: {
        show: false,
      },
      colors: [
        '#14171a',
        '#39434c',
        '#4f5c69',
        '#5a6977',
        '#697b8c',
        '#7f8f9f',
        '#9ca9b4',
        '#b9c2ca',
        '#d9dee2',
        '#ebedf0',
        '#394c49',
        '#465d5a',
        '#516c68',
        '#60807c',
        '#6e918d',
        '#8ea9a6',
        '#b1c4c1',
        '#d0dcda',
      ],
      tooltip: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          size: 30,
          startAngle: -140,
          endAngle: 140,
          expandOnClick: false,
          donut: {
            labels: {
              show: true,
              name: {
                color: '#14171a',
              },
              value: {
                fontSize: '18px',
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
                fontSize: '20px',
                fontWeight: 900,
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
