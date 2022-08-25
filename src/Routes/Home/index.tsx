import React from 'react'
import { Col, Row, Typography } from 'antd'
import NewCalendar from '../../Components/Calendar'
import { AddCosts } from '../../Components/AddCosts'

const { Title } = Typography

const Home = () => {
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
        <Col span={8}></Col>
      </Row>
    </div>
  )
}

export { Home }
