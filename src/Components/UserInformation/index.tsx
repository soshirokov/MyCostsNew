import React, { ChangeEvent, useEffect, useState } from 'react'
import { BarChartOutlined, MailOutlined, TagOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import styles from './styles.module.scss'
import { auth, costLevelRef } from '../../utils/firebase'
import { onValue, set } from 'firebase/database'
import { useSelector } from 'react-redux'
import { currentCurrency } from '../../Store/Currency/selectors'
import { currentRate } from '../../Store/Rate/selectors'
import { baseCurrency } from '../../utils/constants'

export const UserInformation: React.FC = () => {
  const [costLevel, setCostLevel] = useState(0)
  const currency = useSelector(currentCurrency)
  const rate = useSelector(currentRate)

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      onValue(costLevelRef(auth.currentUser.uid), (snapshot) => {
        const displayCostLevel =
          currency === baseCurrency
            ? snapshot.val() || 0
            : Math.round(snapshot.val() * rate) || 0
        setCostLevel(displayCostLevel)
      })
    }
  }, [currency, rate])

  const costLevelChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCostLevel(+e.target.value)
  }

  const keyDowHandler = (e: any) => {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }

  const blurHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (auth?.currentUser?.uid) {
      const newCostLevel =
        currency === baseCurrency
          ? +e.target.value
          : Math.round(+e.target.value / rate)
      set(costLevelRef(auth.currentUser.uid), newCostLevel)
    }
  }

  return (
    <>
      <h2>User Information</h2>
      <Input
        className={styles.UserInformation__Input}
        defaultValue={auth?.currentUser?.email || ''}
        disabled
        type="email"
        size="large"
        placeholder="email"
        prefix={<MailOutlined />}
      />
      <Input
        className={styles.UserInformation__Input}
        defaultValue={auth?.currentUser?.uid || ''}
        disabled
        size="large"
        placeholder="id"
        prefix={<TagOutlined />}
      />
      <Input
        className={styles.UserInformation__Input}
        defaultValue={0}
        value={costLevel}
        type="number"
        size="large"
        onChange={costLevelChangeHandler}
        onBlur={blurHandler}
        onKeyDown={keyDowHandler}
        placeholder="flow rate"
        prefix={<BarChartOutlined />}
      ></Input>
    </>
  )
}
