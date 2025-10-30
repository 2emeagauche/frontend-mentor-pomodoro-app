import { useState, useEffect, useRef} from 'react'
import './App.css'
import Timer from 'advanced-timer'

function App() {

  const [taskDuration, setTaskDuration] = useState(5)
  const [taskDisplay, setTaskDisplay] = useState(taskDuration * 1000)
  const [shortBreakDuration, setShortBreakDuration] = useState(3)
  const [shortBreakDisplay, setShortBreakDisplay] = useState(shortBreakDuration * 1000)
  const [longBreakDuration, setLongBreakDuration] = useState(5)
  const [longBreakDisplay, setLongBreakDisplay] = useState(longBreakDuration * 1000)
  const [isPaused, setIsPaused] = useState(false)
  const [start, setStart] = useState(false)
  const [isStoped, setIsStoped] = useState(new Date())

  const selectedTimer = useRef(null)
  const cycleCount = 4
  let cycle = useRef(cycleCount)

  function somePause(t, shortBreakTimer, longBreakTimer) {
    t.stop()
    console.log("task #"+cycle.current+" finished")
    --cycle.current
    if(cycle.current > 0) {
      shortBreakTimer.reset().start()
      selectedTimer.current = shortBreakTimer
      console.log("short pause started")
    } else {
      longBreakTimer.reset().start()
      selectedTimer.current = longBreakTimer
      console.log("long pause started")
      cycle.current = cycleCount
    }
  }
  
  function breakFinished(t, nextTimer, type) {
    t.stop()
    console.log(type+" pause finished")
    nextTimer.reset().start()
    selectedTimer.current = nextTimer
    console.log("task #"+cycle.current+" started")
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
      cycle.current = cycleCount
      setStart(false)
      setIsStoped(new Date())
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
      cycle.current = cycleCount
      setStart(false)
      setTaskDisplay(taskDuration * 1000)
      setShortBreakDisplay(shortBreakDuration * 1000)
      setLongBreakDisplay(longBreakDuration * 1000)
    }
    
  }, [taskDuration, shortBreakDuration, longBreakDuration, isStoped])

  function handleSubmit(e){
    e.preventDefault()
    const formData = new FormData(e.target)
    const task_value = formData.get("task_value")
    const short_break_value = formData.get("short_break_value")
    const long_break_value = formData.get("long_break_value")

    setTaskDuration(task_value * 1)
    setTaskDisplay(task_value * 1000)
    setShortBreakDuration(short_break_value * 1)
    setShortBreakDisplay(short_break_value * 1000)
    setLongBreakDuration(long_break_value * 1)
    setLongBreakDisplay(long_break_value * 1000)
  }

  return (
    <>
      <p>{taskDisplay}</p>
      <p>{shortBreakDisplay}</p>
      <p>{longBreakDisplay}</p>
      <form onSubmit={handleSubmit}>
        <p><input type="text" name="task_value" defaultValue={taskDuration} /></p>
        <p><input type="text" name="short_break_value" defaultValue={shortBreakDuration} /></p>
        <p><input type="text" name="long_break_value" defaultValue={longBreakDuration} /></p>
        <button type="submit">Apply</button>
      </form>
      <p><button onClick={handleIsPaused}>{isPaused ? 'resume' : 'pause'} timer</button></p>
      <p><button onClick={handleStart}>{start ? 'stop' : 'start'} timer</button></p>
    </>
  )
}

export default App
