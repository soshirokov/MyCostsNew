import { SET_DATE } from './actions'

const initialState = ''

export const calendarReducer: any = (
  state = initialState,
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case SET_DATE:
      return action.payload
    default:
      return state
  }
}
