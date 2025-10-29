import { useState, useEffect } from 'react'
import './App.css'
import Timer from 'advanced-timer'


function App() {

  const [taskDuration, setTaskDuration] = useState(10000)
  const [shortBreakDuration, setShortBreakDuration] = useState(2000)
  const [longBreakDuration, setLongBreakDuration] = useState(5000)
  const cycleCount = 4
  let cycle = cycleCount


  function someBreak(t, sbt, lbt) {
    t.stop()
    console.log("task #"+cycle+" finished")
    --cycle
    if(cycle > 0) {
      sbt.start()
      console.log("short pause started")
    } else {
      lbt.start()
      console.log("long pause started")
      cycle = cycleCount
    }
  }

  function breakEnd(t, taskTimer, type) {
    t.stop()
    console.log(type+" pause finished")
    taskTimer.start()
    console.log("task #"+cycle+" started")
  }

  function breakTimer(breakDuration, taskTimer, type){
    return new Timer(breakDuration).action((t)=>breakEnd(t, taskTimer, type)).repeat(false)
  }
  
  useEffect(() => {
    // const shortBreakTimer = new Timer(shortBreakDuration).action((t)=>breakEnd(t, taskTimer, "short")).repeat(false)
    const longBreakTimer = new Timer(longBreakDuration).action((t)=>breakEnd(t, taskTimer, "long")).repeat(false)
    const taskTimer = new Timer(taskDuration).action((t)=>someBreak(t, shortBreakTimer, longBreakTimer)).repeat(false)
    const shortBreakTimer = breakTimer(shortBreakDuration, taskTimer, "short")
    console.log("task #"+cycle+" started")
    taskTimer.start()

    return ()=>{
      if(taskTimer) taskTimer.destroy()
      if(shortBreakTimer) shortBreakTimer.destroy()
      if(longBreakTimer) longBreakTimer.destroy()
    }

  }, [taskDuration, shortBreakDuration, longBreakDuration])


  return (
    <>
    <input type="text" value={taskDuration} onChange={(e)=>setTaskDuration(e.target.value * 1)} />
    <input type="text" value={shortBreakDuration} onChange={(e)=>setShortBreakDuration(e.target.value * 1)} />
    <input type="text" value={longBreakDuration} onChange={(e)=>setLongBreakDuration(e.target.value * 1)} />
    </>
  )
}

export default App
