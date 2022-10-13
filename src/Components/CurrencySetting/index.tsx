import { Select } from 'antd'
import { onValue, set } from 'firebase/database'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrency } from '../../Store/Currency/actions'
import { currentCurrency } from '../../Store/Currency/selectors'
import { altCurrency, baseCurrency } from '../../utils/constants'
import { auth, userCurrencyRef } from '../../utils/firebase'
const { Option } = Select

const currencies = [baseCurrency, altCurrency]

export const CurrencySetting = () => {
  const currency = useSelector(currentCurrency)
  const [selectedCurrency, setSelectedCurrency] = useState(currency)

  const dispatch = useDispatch()

  const currencyChangeHandler = (newCurrency: string) => {
    setSelectedCurrency(newCurrency)
    dispatch(setCurrency(newCurrency))
    if (auth?.currentUser?.uid) {
      set(userCurrencyRef(auth.currentUser.uid), newCurrency)
    }
  }

  useEffect(() => {
    if (auth?.currentUser?.uid) {
      onValue(userCurrencyRef(auth.currentUser.uid), (snapshot) => {
        if (snapshot.val()) {
          setSelectedCurrency(snapshot.val())
          dispatch(setCurrency(snapshot.val()))
        }
      })
    }
  }, [dispatch])

  return (
    <Select
      style={{ width: 120 }}
      value={selectedCurrency}
      onChange={currencyChangeHandler}
    >
      {currencies.map((currency) => (
        <Option value={currency} key={currency}>
          {currency}
        </Option>
      ))}
    </Select>
  )
}
