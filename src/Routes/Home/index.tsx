import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import NewCalendar from '../../Components/Calendar'
import { AddCosts } from '../../Components/AddCosts'
import { PieChart } from '../../Components/PieChart'
import { StatsLineChart } from '../../Components/StatsLineChart'
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

const Home = () => {
  const selectedDate = useSelector(currentDateSelector)
  const rate = useSelector(currentRate)
  const currency = useSelector(currentCurrency)

  const [categories, setCategories] = useState<Array<string>>([])
  const [costs, setCosts] = useState<CostsServer>({})
  const [costLevel, setCostLevel] = useState(0)

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

  return (
    <div className="Home">
      {Object.keys(costs).length > 0 && (
        <CostStats costs={costs} costLevel={costLevel} />
      )}
      <Row gutter={[{ xs: 0, md: 80 }, 40]}>
        <Col xs={{ span: 24 }} md={{ span: 6 }}>
          <div className="Home__Calendar">
            <NewCalendar />
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 10 }}>
          <div className="Home__AddCosts">
            <AddCosts />
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 8 }}>
          <div className="Home__PieChart">
            {ShowCharts && <PieChart categories={categories} costs={costs} />}
          </div>
          <div className="Home__LineChart">
            {ShowCharts && <StatsLineChart costs={costs} />}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export { Home }
