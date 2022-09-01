import moment, { Moment } from 'moment'

export const getEndOfMonth = (date: Moment) => {
  return moment(date).endOf('month')
}

export const getStartOfMonth = (date: Moment) => {
  return moment(date).startOf('month')
}
