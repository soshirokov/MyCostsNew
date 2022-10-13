import { get, set } from 'firebase/database'
import moment from 'moment'
import { fetchCurrencyRate } from './currencyApi'
import { currencyRate } from './firebase'

export const getCurrencyRate = (base: string, symbol: string) => {
  const todayDate = moment().format('DD-MM-YYYY')

  get(currencyRate(todayDate, `${base}_${symbol}`)).then((snapshot) => {
    const currentCurrencyRate = snapshot.val()

    if (!currentCurrencyRate) {
      fetchCurrencyRate(base, symbol).then((rate) => {
        set(currencyRate(todayDate, `${base}_${symbol}`), rate)
      })
    }
  })
}
