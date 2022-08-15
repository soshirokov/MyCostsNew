import { GET_DATE } from './actions'


const initialState = ''
  
export const calendarReducer:any = (state = initialState, action:any) => {
    switch (action.type) {
        case GET_DATE:
        return action.payload
        default:
            return state
    }
}


