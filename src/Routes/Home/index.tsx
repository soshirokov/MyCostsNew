import React, { useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'
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
import './style/index.scss'

const { Title } = Typography

const Home = () => {
  const selectedDate = useSelector(currentDateSelector)

  const [categories, setCategories] = useState<Array<string>>([])
  const [costs, setCosts] = useState<CostsServer>({})
  const [costLevel, setCostLevel] = useState(0)

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      onValue(costLevelRef(auth.currentUser.uid), (snapshot) =>
        setCostLevel(snapshot.val() || 0)
      )
    }
  }, [])

  useEffect(() => {
    if (auth?.currentUser?.uid && selectedDate.isValid()) {
      const today = moment()
      const lastDayOfStats =
        selectedDate.month() < today.month() &&
        selectedDate.year() <= today.year()
          ? selectedDate.endOf('month')
          : today.endOf('day')
      const firstDayOfStats = selectedDate.startOf('month')

      const myQuery = query(
        costByUserRef(auth.currentUser.uid),
        orderByChild('dateTime'),
        startAt(firstDayOfStats.format('x')),
        endAt(lastDayOfStats.format('x'))
      )

      onValue(myQuery, (snapshot) => setCosts(snapshot.val() || {}))
    }
  }, [selectedDate])

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
      <Title level={2}>Your today costs</Title>
      <Row>
        <Col span={8}>
          <div className="Home__Calendar">
            <NewCalendar />
          </div>
        </Col>
        <Col span={8}>
          <div className="Home__AddCosts">
            <AddCosts />
          </div>
        </Col>
        <Col span={8}>
          <div className="Home__Charts">
            <PieChart categories={categories} costs={costs} />
            <StatsLineChart costs={costs} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export { Home }
