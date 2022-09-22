import { Col, Row } from 'antd'
import moment, { Moment } from 'moment'
import { useSelector } from 'react-redux'
import { currentDateSelector } from '../../Store/Calendar/selectors'
import { getEndOfMonth } from '../../utils/helpers'
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
    : getEndOfMonth(selectedDate).date()

  const monthCostTotal = Object.keys(costs).reduce(
    (acc, key) => acc + +costs[key].total,
    0
  )

  const averageCosts = Math.ceil(monthCostTotal / daysInCount)
  const dayCost = costs[selectedDate.format('DD-MM-YYYY')]
    ? costs[selectedDate.format('DD-MM-YYYY')].total
    : 0
  const forecastCosts = averageCosts * getEndOfMonth(selectedDate).date()
  const balanceCostsTotal = costLevel - monthCostTotal
  const balanceAverageCosts =
    getEndOfMonth(selectedDate).date() - maxDayInCosts.date() > 0
      ? balanceCostsTotal /
        (getEndOfMonth(selectedDate).date() - maxDayInCosts.date())
      : 0
  const balanceCostLevel =
    getEndOfMonth(selectedDate).date() - maxDayInCosts.date() > 0
      ? costLevel / (getEndOfMonth(selectedDate).date() - maxDayInCosts.date())
      : 0

  return (
    <div className={styles.CostStats}>
      <Row gutter={[{ xs: 0, sm: 20 }, 8]}>
        <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
          <CostStatElement title="В этот день" sum={+dayCost} />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
          <CostStatElement
            title="В среднем за день"
            sum={+averageCosts}
            additionalSum={
              +averageCosts - costLevel / getEndOfMonth(selectedDate).date()
            }
            more={
              +averageCosts > costLevel / getEndOfMonth(selectedDate).date()
            }
            type={
              +averageCosts > costLevel / getEndOfMonth(selectedDate).date()
                ? 'negative'
                : 'positive'
            }
          />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
          <CostStatElement title="В этом месяце" sum={+monthCostTotal} />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
          <CostStatElement
            title="Будет за месяц"
            sum={+forecastCosts}
            additionalSum={+forecastCosts - costLevel}
            more={+forecastCosts > costLevel}
            type={+forecastCosts > costLevel ? 'negative' : 'positive'}
          />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
          <CostStatElement
            title="Осталось в день"
            sum={+balanceAverageCosts}
            additionalSum={
              +balanceAverageCosts -
              costLevel / getEndOfMonth(selectedDate).date()
            }
            more={
              +balanceAverageCosts >
              costLevel / getEndOfMonth(selectedDate).date()
            }
            type={
              +balanceAverageCosts <
              costLevel / getEndOfMonth(selectedDate).date()
                ? 'negative'
                : 'positive'
            }
          />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 4 }}>
          <CostStatElement
            title={`Осталось на ${
              getEndOfMonth(selectedDate).date() - maxDayInCosts.date()
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
