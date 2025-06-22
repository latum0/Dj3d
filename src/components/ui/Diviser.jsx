import React, { useEffect, useState } from 'react'
import './Diviser.css';




function diviser({name,title,time , days , hours , minutes , seconds}) {

  const [saleTIme,setSaleTime] = useState(
    {
      days:Number(days),
      hours:Number(hours),
      minutes:Number(minutes),
      seconds:Number(seconds)
    }
  );

  useEffect(()=>{

    const timer = setInterval(() => {
      setSaleTime(prev=>{
        let {days,hours,minutes,seconds}=prev;
        if(seconds>0){return {...prev,seconds : seconds-1}}
        else if(minutes>0){return{...prev,minutes:minutes-1, seconds:59}}
        else if(hours>0){return{...prev,hours:hours-1,minutes:59,seconds:59}}
        else{
          return{...prev,days:days-1,hours:23,minutes:59,seconds:59}
        }
  
      })
      
    }, 1000);
    return ()=>clearInterval(timer);
      
  },[days,hours,minutes,seconds])


  return (
    <div className="diviser-container">
      <div className="text-container">
        <div className="diviser"></div>
        <p>{name}</p>
      </div>
      <div className="diviser-title">
        <p>{title}</p>
        {time && <span>{days}:{hours}:{minutes}:{seconds}</span> }
      </div>
    </div>

    

  )
}

export default diviser