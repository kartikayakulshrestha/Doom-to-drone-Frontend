import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    mousex:0,
    mousey:0,
    unlocked:true,
    drawRect:false,
    image:null,
    imagename:null
  },
  reducers: {
    mouseActivity:(state,action)=>{
      
      state.mousex =action.payload.x
      state.mousey=action.payload.y
    },
    locking:(state,action)=>{
      
      state.unlocked=action.payload
      
    },
    drawing:(state)=>{
      
      state.drawRect?state.drawRect=false:state.drawRect=true
    },
    imageupdates:(state,action)=>{
      
      state.image=action.payload.imageURL
      state.imagename=action.payload.imageName
    }
  }
})

export const { mouseActivity,locking,drawing,imageupdates } = counterSlice.actions

export default counterSlice.reducer