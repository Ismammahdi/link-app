
import { configureStore } from '@reduxjs/toolkit'
import  userSlice  from '../slice/userSlice'
import activeChatSlice from '../slice/activeChatSlice'


export default configureStore({
    
  reducer: {
    userLoginInfo:userSlice,
    activeChatSlice:activeChatSlice
  },
})
