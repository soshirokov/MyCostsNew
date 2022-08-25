import React, { useEffect, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import NewCalendar from '../../Components/Calendar'
import { AddCosts } from '../../Components/AddCosts'
import { PieChart } from '../../Components/PieChart'
import { auth, costByUserRef, userCategories } from '../../utils/firebase'
import {
  limitToFirst,
  onValue,
  orderByChild,
  query,
  startAt,
} from 'firebase/database'
import { useSelector } from 'react-redux'
import { currentDateSelector } from '../../Store/Calendar/selectors'
import moment from 'moment'
import { CostsServer } from '../../utils/types'

const { Title } = Typography

const Home = () => {
  const selectedDate = useSelector(currentDateSelector)

  const [categories, setCategories] = useState<Array<string>>([])
  const [costs, setCosts] = useState<CostsServer>({})

  useEffect(() => {
    if (auth?.currentUser?.uid && selectedDate.isValid()) {
      const today = moment()
      const lastDayOfStats =
        selectedDate.month() < today.month() &&
        selectedDate.year() <= today.year()
          ? selectedDate.endOf('month').date()
          : today.date()
      const firstDayOfStats = selectedDate.startOf('month')

      const myQuery = query(
        costByUserRef(auth.currentUser.uid),
        orderByChild('dateTime'),
        startAt(firstDayOfStats.millisecond()),
        limitToFirst(lastDayOfStats)
      )

      console.log(myQuery)

      onValue(myQuery, (snapshot) => setCosts(snapshot.val() || []))
    }
  }, [selectedDate])

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      onValue(userCategories(auth.currentUser.uid), (snapshot) => {
        setCategories(snapshot.val() ? snapshot.val() : [])
      })
    }
  }, [])

  return (
    <div className="Home">
      <Title level={2}>Your today costs</Title>
      <Row>
        <Col span={8}>
          <NewCalendar />
        </Col>
        <Col span={8}>
          <AddCosts />
        </Col>
        <Col span={8}>
          <PieChart categories={categories} costs={costs} />
        </Col>
      </Row>
    </div>
  )
}

export { Home }
