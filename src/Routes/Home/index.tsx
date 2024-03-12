import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import NewCalendar from '../../Components/Calendar'
import { AddCosts } from '../../Components/AddCosts'
import { PieChart } from '../../Components/PieChart'
import {
  auth,
  costByUserRef,
  costLevelRef,
  userCategories,
} from '../../utils/firebase'
import { endAt, onValue, orderByChild, query, startAt } from 'firebase/database'
import { useSelector } from 'react-redux'
import { currentDateSelector } from '../../Store/Calendar/selectors'
import moment from 'moment'
import { CostsServer } from '../../utils/types'
import { CostStats } from '../../Components/CostStats'
import { getEndOfMonth, getStartOfMonth } from '../../utils/helpers'
import { currentRate } from '../../Store/Rate/selectors'
import { currentCurrency } from '../../Store/Currency/selectors'
import { baseCurrency } from '../../utils/constants'
import { convertAllToRate } from '../../utils/costConverters'
import { AccumulationLineChart } from '../../Components/AccumulationLineChart'
import { loadLastMonthCosts, loadLastThreeMonthCosts } from '../../requests'
import { CostStatElement } from '../../Components/CostStatElement'
import styles from './styles.module.scss'

const Home = () => {
  const selectedDate = useSelector(currentDateSelector)
  const rate = useSelector(currentRate)
  const currency = useSelector(currentCurrency)

  const [categories, setCategories] = useState<Array<string>>([])
  const [costs, setCosts] = useState<CostsServer>({})
  const [costLevel, setCostLevel] = useState(0)
  const [lastMonthCosts, setLastMonthCosts] = useState(0)
  const [lastThreeMonthCosts, setLastThreeMonthCosts] = useState(0)

  const ShowCharts = categories.length > 0 && Object.keys(costs).length > 0

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      onValue(costLevelRef(auth.currentUser.uid), (snapshot) => {
        const costLevel =
          currency === baseCurrency
            ? snapshot.val() || 0
            : Math.round(snapshot.val() * rate)
        setCostLevel(costLevel)
      })
    }
  }, [currency, rate])

  useEffect(() => {
    if (auth?.currentUser?.uid && selectedDate.isValid()) {
      const today = moment()
      const lastDayOfStats =
        selectedDate.month() < today.month() &&
        selectedDate.year() <= today.year()
          ? getEndOfMonth(selectedDate)
          : today.endOf('day')
      const firstDayOfStats = getStartOfMonth(selectedDate)

      const myQuery = query(
        costByUserRef(auth.currentUser.uid),
        orderByChild('dateTime'),
        startAt(firstDayOfStats.format('x')),
        endAt(lastDayOfStats.format('x'))
      )

      onValue(myQuery, (snapshot) => {
        const displayCosts =
          currency === baseCurrency
            ? snapshot.val() || {}
            : convertAllToRate(rate, snapshot.val())
        setCosts(displayCosts)
      })
    }
  }, [selectedDate, currency, rate])

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      onValue(userCategories(auth.currentUser.uid), (snapshot) => {
        setCategories(snapshot.val() ? snapshot.val() : {})
      })
    }
  }, [])

  useEffect(() => {
    async function getRecentCosts() {
      const lastMonth = await loadLastMonthCosts({
        userId: auth.currentUser?.uid ?? '',
        currentDate: selectedDate,
      })

      const lastThreeMonth = await loadLastThreeMonthCosts({
        userId: auth.currentUser?.uid ?? '',
        currentDate: selectedDate,
      })

      setLastMonthCosts(lastMonth)
      setLastThreeMonthCosts(lastThreeMonth)
    }
    if (auth?.currentUser?.uid) {
      getRecentCosts()
    }
  }, [selectedDate])

  return (
    <div className="Home">
      {Object.keys(costs).length > 0 && (
        <CostStats
          costs={costs}
          costLevel={costLevel}
          lastMonthCosts={lastMonthCosts}
        />
      )}
      <Row gutter={[{ xs: 0, md: 80 }, 40]}>
        <Col xs={{ span: 24 }} md={{ span: 7 }}>
          <div className={styles.CalendarBlockWrapper}>
            <NewCalendar />
            <CostStatElement
              title="Расходы за последние 3 месяца"
              sum={lastThreeMonthCosts}
              additionalSum={lastThreeMonthCosts / 3 - costLevel}
              additionalDesc=" (в среднем в месяц)"
              type={
                lastThreeMonthCosts / 3 - costLevel < 0
                  ? 'positive'
                  : 'negative'
              }
            />
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 9 }}>
          <AddCosts />
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          {ShowCharts && <PieChart categories={categories} costs={costs} />}
          {ShowCharts && (
            <AccumulationLineChart costs={costs} costLevel={costLevel} />
          )}
        </Col>
      </Row>
    </div>
  )
}

export { Home }
