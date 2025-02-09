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
  EnterOutlined,
} from '@ant-design/icons'
import styles from './styles.module.scss'

const clearValueExtraChars = (str: string) =>
  str
    .replace(/[^0-9+-/*]/g, '')
    .replace('++', '+')
    .replace('--', '-')
    .replace('//', '/')
    .replace('**', '*')

export const AddCosts = () => {
  const currentDate = useSelector(currentDateSelector)
  const currency: string = useSelector(currentCurrency)
  const rate = useSelector(currentRate)
  const [categories, setCategories] = useState<Categories>([])
  const [costs, setCosts] = useState<Costs>({})
  const [currentInput, setCurrentInput] = useState<HTMLInputElement | null>(
    null
  )
  const [currentCategory, setCurrentCategory] = useState('')

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
    e.target.value = clearValueExtraChars(e.target.value)

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

    if (isNaN(toSave)) {
      return
    }

    const newCosts = { ...costs, [category]: Math.ceil(toSave) }

    setCosts(newCosts)
    saveCostsToFirebase(newCosts)
    setCurrentInput(null)
    setCurrentCategory('')
  }

  const focusHandler = (e: ChangeEvent<HTMLInputElement>, category: string) => {
    setCurrentInput(e.target)
    setCurrentCategory(category)
  }

  const keyDowHandler = (e: any) => {
    if (e.keyCode === 13) {
      e.target.blur()
    }
  }

  const addSignHandler = (sign: string) => {
    if (currentInput) {
      currentInput.value = clearValueExtraChars(currentInput.value + sign)
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
          <div className={styles.InputWrapper}>
            <Input
              value={costs[category] !== 0 ? costs[category] : ''}
              defaultValue=""
              className={styles.AddCosts__Input}
              onChange={(e) => changeHandler(e, category)}
              onBlur={(e) => blurHandler(e, category)}
              onFocus={(e) => focusHandler(e, category)}
              onKeyDown={keyDowHandler}
              key={category}
              suffix={<div className={styles.AddCosts__Label}>{category}</div>}
              addonBefore={
                <div className={styles.AddCosts__Label}>
                  {currencySymbol[currency]}
                </div>
              }
              pattern="\d*"
            />
            {currentInput && currentCategory === category && (
              <div
                className={styles.actions}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Button
                  type="default"
                  shape="circle"
                  size="large"
                  icon={<PlusCircleOutlined />}
                  onClick={() => addSignHandler('+')}
                />
                <Button
                  type="default"
                  shape="circle"
                  size="large"
                  icon={<MinusCircleOutlined />}
                  onClick={() => addSignHandler('-')}
                />
                <Button
                  type="default"
                  shape="circle"
                  size="large"
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
                  size="large"
                  icon={<CloseCircleOutlined />}
                  onClick={() => addSignHandler('*')}
                />
                <Button
                  type="default"
                  shape="circle"
                  size="large"
                  icon={<EnterOutlined />}
                  onClick={() => {
                    if (currentInput) {
                      currentInput.blur()
                    }
                  }}
                />
              </div>
            )}
          </div>
        ))}
    </div>
  )
}
