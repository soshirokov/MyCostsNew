import { SET_RATE } from './actions'

const initialState = 0

export const rateReducer = (
  state = initialState,
  action: { type: string; payload: number }
) => {
  switch (action.type) {
    case SET_RATE:
      return action.payload
    default:
      return state
  }
}
