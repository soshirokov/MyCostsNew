import type { Moment } from 'moment'
export const GET_DATE = "GET_DATE"

export const getDate = (date: Moment) => ({
    type: GET_DATE,
    payload: date
  });