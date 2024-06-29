import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../app/reducer_action'
export default configureStore({
  reducer: {
    counter: counterReducer,
  }
})