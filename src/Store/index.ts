import { configureStore } from '@reduxjs/toolkit'
import { calendarReducer } from './Calendar/reducer'

export const store = configureStore({
  reducer: { calendar: calendarReducer },
})
