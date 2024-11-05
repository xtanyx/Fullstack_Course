import { createSlice } from "@reduxjs/toolkit"

const initialState = null
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    changeNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return null
    }
  }
})

export const setNotification = (message, seconds) => {
  console.log('notification....')
  return async (dispatch) => {
    dispatch(changeNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, seconds*1000)
  }
}

export const {changeNotification, removeNotification} = notificationSlice.actions
export default notificationSlice.reducer