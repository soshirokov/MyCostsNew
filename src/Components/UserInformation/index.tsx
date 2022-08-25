import React from 'react'
import { BarChartOutlined, MailOutlined, TagOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import styles from './styles.module.scss'

export const UserInformation: React.FC = () => {
  return (
    <>
      <h2>User Information</h2>
      <Input
        className={styles.UserInformation__Input}
        defaultValue="user@gmail.com"
        type="email"
        size="large"
        placeholder="email"
        prefix={<MailOutlined />}
      />
      <Input
        className={styles.UserInformation__Input}
        defaultValue="FXJceOb435MxE4APJEP5PKtNpBB2"
        size="large"
        placeholder="id"
        prefix={<TagOutlined />}
      />
      <Input
        className={styles.UserInformation__Input}
        defaultValue="10000"
        type="number"
        size="large"
        placeholder="flow rate"
        prefix={<BarChartOutlined />}
      ></Input>
      <div className={styles.UserInformation__ButtonBox}>
        <Button
          className={styles.UserInformation__Button}
          type="primary"
          size="large"
        >
          Save
        </Button>
      </div>
    </>
  )
}
