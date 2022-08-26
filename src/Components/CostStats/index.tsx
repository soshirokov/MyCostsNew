import { Col, Row } from 'antd'
import moment, { Moment } from 'moment'
import { useSelector } from 'react-redux'
import { currentDateSelector } from '../../Store/Calendar/selectors'
import { CostsServer } from '../../utils/types'
import { CostStatElement } from '../CostStatElement'
import styles from './styles.module.scss'

type Props = {
  costs: CostsServer
  costLevel: number
}

const CostStats = ({ costs, costLevel }: Props) => {
  const selectedDate = useSelector(currentDateSelector)

  const isCurrentMonth = (date: Moment) => {
    return date.month() === moment().month() && date.year() === moment().year()
  }

  const maxDayInCosts = moment(
    costs[Object.keys(costs)[Object.keys(costs).length - 1]].dateTime,
    'x'
  )
  const daysInCount = isCurrentMonth(selectedDate)
    ? maxDayInCosts.date()
    : selectedDate.endOf('month').date()

  const monthCostTotal = Object.keys(costs).reduce(
    (acc, key) => acc + +costs[key].total,
    0
  )
  const averageCosts = Math.ceil(monthCostTotal / daysInCount)
  const dayCost = costs[selectedDate.format('DD-MM-YYYY')]
    ? costs[selectedDate.format('DD-MM-YYYY')].total
    : 0
  const forecastCosts = averageCosts * selectedDate.endOf('month').date()
  const balanceCostsTotal = costLevel - monthCostTotal
  const balanceAverageCosts =
    balanceCostsTotal /
    (selectedDate.endOf('month').date() - maxDayInCosts.date())
  const balanceCostLevel =
    costLevel / (selectedDate.endOf('month').date() - maxDayInCosts.date())

  return (
    <div className={styles.CostStats}>
      <Row gutter={20}>
        <Col span={4}>
          <CostStatElement title="В этот день" sum={+dayCost} />
        </Col>
        <Col span={4}>
          <CostStatElement
            title="В среднем за день"
            sum={+averageCosts}
            additionalSum={
              +averageCosts - costLevel / selectedDate.endOf('month').date()
            }
            more={
              +averageCosts > costLevel / selectedDate.endOf('month').date()
            }
            type={
              +averageCosts > costLevel / selectedDate.endOf('month').date()
                ? 'negative'
                : 'positive'
            }
          />
        </Col>
        <Col span={4}>
          <CostStatElement title="В этом месяце" sum={+monthCostTotal} />
        </Col>
        <Col span={4}>
          <CostStatElement
            title="Будет за месяц"
            sum={+forecastCosts}
            additionalSum={+forecastCosts - costLevel}
            more={+forecastCosts > costLevel}
            type={+forecastCosts > costLevel ? 'negative' : 'positive'}
          />
        </Col>
        <Col span={4}>
          <CostStatElement
            title="Осталось в день"
            sum={+balanceAverageCosts}
            additionalSum={
              +balanceAverageCosts -
              costLevel / selectedDate.endOf('month').date()
            }
            more={
              +balanceAverageCosts >
              costLevel / selectedDate.endOf('month').date()
            }
            type={
              +balanceAverageCosts <
              costLevel / selectedDate.endOf('month').date()
                ? 'negative'
                : 'positive'
            }
          />
        </Col>
        <Col span={4}>
          <CostStatElement
            title={`Осталось на ${
              selectedDate.endOf('month').date() - maxDayInCosts.date()
            } дней`}
            sum={+balanceCostsTotal}
            additionalSum={+balanceCostsTotal - balanceCostLevel}
            more={+balanceCostsTotal > balanceCostLevel}
            type={
              +balanceCostsTotal < balanceCostLevel ? 'negative' : 'positive'
            }
          />
        </Col>
      </Row>
    </div>
  )
}

export { CostStats }
