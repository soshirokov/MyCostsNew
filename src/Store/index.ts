import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { calendarReducer } from './Calendar/reducer'
import { currencyReducer } from './Currency/reducer'
import { rateReducer } from './Rate/reducer'

const reducer = combineReducers({
  calendar: calendarReducer,
  currency: currencyReducer,
  rate: rateReducer,
})

export const store = configureStore({
  reducer,
})
