import React, { useEffect, useState } from "react";
import { FcInfo } from "react-icons/fc";
import { IoMdSkipBackward } from "react-icons/io";
import { IoMdSkipForward } from "react-icons/io";

import { HiMiniMagnifyingGlassPlus } from "react-icons/hi2";
import { HiMiniMagnifyingGlassMinus } from "react-icons/hi2";
import { VscScreenFull } from "react-icons/vsc";
import { MdLockOutline } from "react-icons/md";
import { MdLockOpen } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import { PiArrowSquareInThin } from "react-icons/pi";
import { HiShare } from "react-icons/hi2";
import { BsStars } from "react-icons/bs";
import { TbPencilPin } from "react-icons/tb";
import { BiCommentAdd } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {locking,drawing} from "../app/reducer_action"
const absolutepositions = () => {
  const [lock,setlock]=useState(1)
  const imagename=useSelector((state)=>state.counter.imagename)
  const dispatch=useDispatch();
  const mousex=useSelector((state)=>state.counter.mousex)
  const mousey=useSelector((state)=>state.counter.mousey)
  const drawRect=useSelector((state)=>state.counter.drawRect)
  const [instaMenu,setInstaMenu]=useState(0)
  
  
  const lockinghandle=()=>{
    if(lock){
      setlock(false)
      dispatch(locking(false))
    }else{
      setlock(true)
      dispatch(locking(true))
    }
  }
  const handledrawclick=()=>{
    dispatch(drawing())
  }
  return (
    <div>
      <div class="absolute z-20 top-0 left-0 p-3 h-8 bg-white  flex items-center justify-center rounded-md font-bold">
        <FcInfo size={24} className="mr-3" /> {imagename}.jpg
      </div>
      {instaMenu?null:
      <div class="absolute z-20 top-8 right-2   items-center justify-center rounded-md font-bold">
      <div className={`my-3 p-1  bg-white ${drawRect?'bg-slate-300':'bg-white'} rounded-md`}>
      <PiArrowSquareInThin size={32} onClick={handledrawclick}/>
      </div>
      
      <div className="my-3  p-1 bg-white rounded-md">
      <HiShare size={32}/>
      <BsStars size={32}/>
      </div>
      <div className="my-3 p-1 bg-white rounded-md">
        <TbPencilPin size={32}/><BiCommentAdd size={32}/></div>
      
    </div>}
      
      <div class="absolute z-20 top-0 right-0 w-20 bg-black bg-opacity-50 flex items-center justify-center text-white">
        <div className="grid grid-cols-2">
            <div className="col-span-1">
                <button onClick={lockinghandle}>
                {lock? <MdLockOpen size={28}/> : <MdLockOutline size={28}/>}
                </button>
               
            </div>
            <div className="col-span-1">
                <button onClick={()=>{instaMenu?setInstaMenu(0):setInstaMenu(1)}}>
                {instaMenu? <IoMdAddCircleOutline size={28}/> : <IoMdCloseCircleOutline size={28}/>}
                </button>
                
            </div>
        </div>
        
      </div>
      <div class="absolute z-20 bottom-0 left-0 p-3 bg-white flex items-center justify-center rounded-md font-bold">
        <IoMdSkipBackward size={24} color={"#1E90FF"} className="mr-3" />
        <span>2 / 4 </span>
        <IoMdSkipForward size={24} color={"#1E90FF"} className="ml-3" />
      </div>
      <div class="absolute z-20 bottom-0 right-0 p-2 w-10 h-30 rounded-md bg-white items-center justify-center">
        <HiMiniMagnifyingGlassPlus size={25} className="mb-3" />
        <HiMiniMagnifyingGlassMinus size={25} className="mb-3" />
        <VscScreenFull size={25} />
      </div>
    <div className={`absolute z-20  w-full border-4 pointer-events-none border-t border-dashed border-white`} style={{top:mousey+"px"}}>

    </div>
    <div className={`absolute z-20 h-full top-0 pointer-events-none border-4 border-l border-dashed border-white`} style={{left:mousex+"px"}}>

    </div>
    </div>

    
  );
};

export default absolutepositions;
