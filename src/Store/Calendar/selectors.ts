import moment from 'moment'

export const currentDateSelector = (state: { calendar: string }) =>
  moment(state.calendar, 'DD-MM-YYYY')
