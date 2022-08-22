import React from 'react'
import { Col, Row, Typography, Button } from 'antd'
import NewCalendar from '../../Components/Calendar'
import { AddCosts } from '../../Components/AddCosts'
import { logout } from '../../utils/firebase'
import './style/index.scss'

const { Title } = Typography

const Home = () => {
  return (
    <div className="Home">
      <div className="Logout">
        <Button type="text" onClick={logout}>
          Logout
        </Button>
      </div>
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
