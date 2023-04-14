import React,{useState,useEffect} from 'react'

const padTime = time => {
    return String(time).length === 1 ? `0${time}` : `${time}`;
  };
const format = time => {
    //seconds into minutes and take the whole part
    const minutes = Math.floor(time / 60);
  
    // seconds left after converting minutes
    const seconds = time % 60;
  
    //combined values as string in format mm:ss
    return `${minutes}:${padTime(seconds)}`;
  };
function TimeCountDown({duration}) {
    const [counter,setCounter]=useState(duration)
    
    useEffect(()=>{
        let timer
        if (counter > 0) {
            timer = setTimeout(() => setCounter(c => c - 1), 1000);
          }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    },[counter])
  return (
    <div className=''>
        {counter === 0 ? "Time over" : <div>{format(counter)} Minutes</div>}
    </div>
  )
}

export default TimeCountDown