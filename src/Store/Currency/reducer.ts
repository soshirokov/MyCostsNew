import { SET_CURRENCY } from './actions'

const initialState = 'RUB'

export const currencyReducer: any = (
  state = initialState,
  action: { type: string; payload: string }
) => {
  switch (action.type) {
    case SET_CURRENCY:
      return action.payload
    default:
      return state
  }
}
