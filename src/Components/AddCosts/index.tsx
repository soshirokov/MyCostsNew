import { Button, Input, message } from 'antd'
import { onValue, set } from 'firebase/database'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { currentDateSelector } from '../../Store/Calendar/selectors'
import { currentCurrency } from '../../Store/Currency/selectors'
import { currentRate } from '../../Store/Rate/selectors'
import { baseCurrency, currencySymbol } from '../../utils/constants'
import { convertFromRate, convertToRate } from '../../utils/costConverters'
import { auth, costByDateRef, userCategories } from '../../utils/firebase'
import { Categories, Costs, CostServer } from '../../utils/types'
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import styles from './styles.module.scss'

export const AddCosts = () => {
  const currentDate = useSelector(currentDateSelector)
  const currency: string = useSelector(currentCurrency)
  const rate = useSelector(currentRate)
  const [categories, setCategories] = useState<Categories>([])
  const [costs, setCosts] = useState<Costs>({})
  const [currentInput, setCurrentInput] = useState<HTMLInputElement | null>(
    null
  )

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      onValue(userCategories(auth.currentUser.uid), (snapshot) => {
        setCategories(snapshot.val() ? snapshot.val() : [])
      })

      onValue(
        costByDateRef(auth.currentUser.uid, currentDate.format('DD-MM-YYYY')),
        (snapshot) => {
          const costsFromServer: CostServer = snapshot.val()
          if (costsFromServer?.details) {
            const displayCosts =
              currency === baseCurrency
                ? costsFromServer.details
                : convertToRate(rate, costsFromServer.details)

            setCosts(displayCosts)
          } else {
            setCosts({})
          }
        }
      )
    }
  }, [currentDate, currency, rate])

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    category: string
  ) => {
    e.target.value = e.target.value
      .replace(/[^0-9+-/*]/g, '')
      .replace('++', '+')
      .replace('--', '-')
      .replace('//', '/')
      .replace('**', '*')

    if (+e.target.value === 0) {
      e.target.value = ''
    }
    setCosts((prevState) => ({
      ...prevState,
      [category]: e.target.value,
    }))
  }

  const blurHandler = (e: ChangeEvent<HTMLInputElement>, category: string) => {
    e.target.value = /[0-9]/g.test(e.target.value.slice(-1))
      ? e.target.value
      : e.target.value.slice(0, e.target.value.length - 1)

    // eslint-disable-next-line no-eval
    const toSave = e.target.value ? eval(e.target.value) : ''

    if (+e.target.value === 0) {
      e.target.value = ''
    }

    const newCosts = { ...costs, [category]: toSave }

    setCosts(newCosts)
    saveCostsToFirebase(newCosts)
    setCurrentInput(null)
  }

  const focusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target)
  }

  const keyDowHandler = (e: any) => {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }

  const addSignHandler = (sign: string) => {
    if (currentInput) {
      currentInput.value += sign
    }
  }

  const saveCostsToFirebase = (inputCosts: Costs) => {
    const costsToSave =
      currency === baseCurrency ? inputCosts : convertFromRate(rate, inputCosts)

    if (auth?.currentUser?.uid) {
      const info = {
        total: 0,
        dateTime: currentDate.format('x'),
      }

      for (const prop in costsToSave) {
        if (!costsToSave[prop]) {
          costsToSave[prop] = 0
        } else {
          info.total += +costsToSave[prop]
        }
      }

      try {
        set(
          costByDateRef(auth.currentUser.uid, currentDate.format('DD-MM-YYYY')),
          { ...info, details: costsToSave }
        )
        message.success('Costs saved!')
      } catch (e) {
        message.error((e as Error).message)
      }
    }
  }

  return (
    <div className={styles.AddCosts}>
      {categories.length > 0 &&
        categories.map((category) => (
          <Input
            value={costs[category] !== 0 ? costs[category] : ''}
            defaultValue=""
            className={styles.AddCosts__Input}
            onChange={(e) => changeHandler(e, category)}
            onBlur={(e) => blurHandler(e, category)}
            onFocus={focusHandler}
            onKeyDown={keyDowHandler}
            key={category}
            suffix={<div className={styles.AddCosts__Label}>{category}</div>}
            addonBefore={
              <div className={styles.AddCosts__Label}>
                {currencySymbol[currency]}
              </div>
            }
          />
        ))}
      {currentInput && (
        <div className={styles.actions} onMouseDown={(e) => e.preventDefault()}>
          <Button
            type="default"
            shape="circle"
            icon={<PlusCircleOutlined />}
            onClick={() => addSignHandler('+')}
          />
          <Button
            type="default"
            shape="circle"
            icon={<MinusCircleOutlined />}
            onClick={() => addSignHandler('-')}
          />
          <Button
            type="default"
            shape="circle"
            icon={
              <MinusCircleOutlined
                className={styles.divideIcon}
                onClick={() => addSignHandler('/')}
              />
            }
          />
          <Button
            type="default"
            shape="circle"
            icon={<CloseCircleOutlined />}
            onClick={() => addSignHandler('*')}
          />
        </div>
      )}
    </div>
  )
}
