import { useState, useEffect, useRef} from 'react'
import Timer from 'advanced-timer'

export function useTimer(
                          {
                            taskDuration,
                            shortBreakDuration,
                            longBreakDuration,
                            setTaskDisplay,
                            setShortBreakDisplay,
                            setLongBreakDisplay
                          }
                        )
  {

  const [isPaused, setIsPaused] = useState(false)
  const [start, setStart] = useState(false)

  const selectedTimer = useRef(null)
  const cycleCount = 4
  let cycle = cycleCount

  function somePause(t, shortBreakTimer, longBreakTimer) {
    t.stop()
    console.log("task #"+cycle+" finished")
    --cycle
    if(cycle > 0) {
      shortBreakTimer.reset().start()
      selectedTimer.current = shortBreakTimer
      console.log("short pause started")
    } else {
      longBreakTimer.reset().start()
      selectedTimer.current = longBreakTimer
      console.log("long pause started")
      cycle = cycleCount
    }
  }
  
  function breakFinished(t, nextTimer, type) {
    t.stop()
    console.log(type+" pause finished")
    nextTimer.reset().start()
    selectedTimer.current = nextTimer
    console.log("task #"+cycle+" started")
  }

  function breakTimeHandler(type, nextTimer){
    const breakOptions = {
      "short": {
        duration: shortBreakDuration,
        setDisplay: setShortBreakDisplay
      },
      "long": {
        duration: longBreakDuration,
        setDisplay: setLongBreakDisplay
      },
    }
    return new Timer(1000)
                .action(()=>breakOptions[type].setDisplay(prev=>prev-1000))
                .repeat(breakOptions[type].duration)
                .done((t)=>{
                  breakOptions[type].setDisplay(breakOptions[type].duration * 1000)
                  breakFinished(t, nextTimer, type)
                })
  }

  function handleIsPaused() {
    if(isPaused) {
      setIsPaused(false)
      selectedTimer.current.resume()
    } else {
      setIsPaused(true)
      selectedTimer.current.pause()
    }
  }

  function handleStart() {
    if(start) {
      selectedTimer.current.stop()
      cycle = cycleCount
      setStart(false)
      setTaskDisplay(taskDuration * 1000)
      setShortBreakDisplay(shortBreakDuration * 1000)
      setLongBreakDisplay(longBreakDuration * 1000)
    } else {
      setStart(true)
      selectedTimer.current.start()
    }
  }
  
  function handleSetTaskDisplay(){
    console.log(selectedTimer.current.status)
    setTaskDisplay(prev=>prev-1000)
  }
    
  useEffect(() => {
    const taskTimer = new Timer(1000)
                          .action(handleSetTaskDisplay)
                          .repeat(taskDuration)
                          .done((t)=>{
                                        somePause(t, shortBreakTimer, longBreakTimer)
                                        setTaskDisplay(taskDuration * 1000)
                                      })
    const shortBreakTimer = breakTimeHandler("short", taskTimer)
    const longBreakTimer = breakTimeHandler("long", taskTimer)
    selectedTimer.current = taskTimer
    
    return ()=>{
      if(taskTimer) {
        taskTimer.destroy()
      }
      if(shortBreakTimer) {
        shortBreakTimer.destroy()
      }
      if(longBreakTimer) {
        longBreakTimer.destroy()
      }
      selectedTimer.current = null
      setStart(false)
    }
    
  }, [taskDuration, shortBreakDuration, longBreakDuration])

  
  return {
    isPaused,
    start,
    handleStart,
    handleIsPaused,
  }
}

