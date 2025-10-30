import { useState, useEffect, useRef } from 'react'
import './App.css'
import Timer from 'advanced-timer'

function App() {

  const [taskDuration, setTaskDuration] = useState(10)
  const [taskDisplay, setTaskDisplay] = useState(taskDuration * 1000)
  const [shortBreakDuration, setShortBreakDuration] = useState(2000)
  const [shortBreakDisplay, setShortBreakDisplay] = useState(shortBreakDuration * 1000)
  const [longBreakDuration, setLongBreakDuration] = useState(5000)
  const [longBreakDisplay, setLongBreakDisplay] = useState(longBreakDuration * 1000)
  const [pause, setPause] = useState(false)
  const [start, setStart] = useState(false)
  const runningTimer = useRef(null)
  const cycleCount = 4
  let cycle = cycleCount

  function someBreak(t, shortBreakTimer, longBreakTimer) {
    t.stop()
    console.log("task #"+cycle+" finished")
    --cycle
    if(cycle > 0) {
      shortBreakTimer.reset().start()
      runningTimer.current = shortBreakTimer
      console.log("short pause started")
    } else {
      longBreakTimer.reset().start()
      runningTimer.current = longBreakTimer
      console.log("long pause started")
      cycle = cycleCount
    }
  }
  
  function breakEnd(t, taskTimer, type) {
    t.stop()
    console.log(type+" pause finished")
    taskTimer.start()
    runningTimer.current = taskTimer
    console.log("task #"+cycle+" started")
  }

  function breakTimer(breakDuration, taskTimer, type){
    return new Timer(breakDuration).action((t)=>breakEnd(t, taskTimer, type)).repeat(false)
  }

  function handlePause() {
    if(pause) {
      setPause(false)
      runningTimer.current.resume()
    } else {
      setPause(true)
      runningTimer.current.pause()
    }
  }

  function handleStart() {
    console.log(runningTimer.current.statusCode)
    if(start) {
      setStart(false)
      setTaskDisplay(taskDuration * 1000)
      runningTimer.current.stop()
      cycle = cycleCount
    } else {
      setStart(true)
      runningTimer.current.reset().start()
      console.log("task #"+cycle+" started")
    }
  }

  function handleTaskDisplay(){
    setTaskDisplay(prev=>prev-1000)
  }
  
  useEffect(() => {
    const taskTimer = new Timer(1000)
                          .action(handleTaskDisplay)
                          .repeat(taskDuration)
                          .done((t)=>{
                                      someBreak(t, shortBreakTimer, longBreakTimer)
                                      setTaskDisplay(taskDuration * 1000)
                                    })
    // const taskTimer = new Timer(1000).action((t)=>console.log(t.timestamp)).repeat(taskDuration).done((t)=>console.log(t.status))
    const shortBreakTimer = breakTimer(shortBreakDuration, taskTimer, "short")
    const longBreakTimer = breakTimer(longBreakDuration, taskTimer, "long")
    runningTimer.current = taskTimer

    return ()=>{
      if(taskTimer) taskTimer.destroy()
      if(shortBreakTimer) shortBreakTimer.destroy()
      if(longBreakTimer) longBreakTimer.destroy()
    }

  }, [taskDuration, shortBreakDuration, longBreakDuration])


  return (
    <>
    <p>{taskDisplay}</p>
    <p>{shortBreakDisplay}</p>
    <p>{longBreakDisplay}</p>
    <p><input type="text" value={taskDuration} onChange={(e)=>setTaskDuration(e.target.value * 1)} /></p>
    <p><input type="text" value={shortBreakDuration} onChange={(e)=>setShortBreakDuration(e.target.value * 1)} /></p>
    <p><input type="text" value={longBreakDuration} onChange={(e)=>setLongBreakDuration(e.target.value * 1)} /></p>
    <p><button onClick={handlePause}>{pause ? 'resume' : 'pause'} timer</button></p>
    <p><button onClick={handleStart}>{start ? 'stop' : 'start'} timer</button></p>
    </>
  )
}

export default App
