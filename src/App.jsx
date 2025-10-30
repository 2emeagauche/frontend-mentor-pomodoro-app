import { useState, useEffect, useRef } from 'react'
import './App.css'
import Timer from 'advanced-timer'

function App() {

  const [taskDuration, setTaskDuration] = useState(10)
  const [taskDisplay, setTaskDisplay] = useState(taskDuration * 1000)
  const [shortPauseDuration, setShortPauseDuration] = useState(2)
  const [shortPauseDisplay, setShortPauseDisplay] = useState(shortPauseDuration * 1000)
  const [longPauseDuration, setLongPauseDuration] = useState(5)
  const [longPauseDisplay, setLongPauseDisplay] = useState(longPauseDuration * 1000)
  const [isPaused, setIsPaused] = useState(false)
  const [start, setStart] = useState(false)
  const selectedTimer = useRef(null)
  const cycleCount = 4
  let cycle = cycleCount

  function somePause(t, shortPauseTimer, longPauseTimer) {
    t.stop()
    console.log("task #"+cycle+" finished")
    --cycle
    if(cycle > 0) {
      shortPauseTimer.reset().start()
      selectedTimer.current = shortPauseTimer
      console.log("short pause started")
    } else {
      longPauseTimer.reset().start()
      selectedTimer.current = longPauseTimer
      console.log("long pause started")
      cycle = cycleCount
    }
  }
  
  function pauseEnd(t, taskTimer, type) {
    t.stop()
    console.log(type+" pause finished")
    taskTimer.start()
    selectedTimer.current = taskTimer
    console.log("task #"+cycle+" started")
  }

  function pauseTimer(type, taskTimer){
    return new Timer(1000)
                .action(()=>setShortPauseDisplay(prev=>prev-1000))
                .repeat(type === "short" ? shortPauseDuration : longPauseDuration)
                .done((t)=>{
                  setShortPauseDisplay((type === "short" ? shortPauseDuration : longPauseDuration) * 1000)
                  pauseEnd(t, taskTimer, type)
                })
  }

  function handlePause() {
    if(isPaused) {
      setIsPaused(false)
      selectedTimer.current.resume()
    } else {
      setIsPaused(true)
      selectedTimer.current.pause()
    }
  }

  function handleStart() {
    console.log(selectedTimer.current.statusCode)
    if(start) {
      setStart(false)
      setTaskDisplay(taskDuration * 1000)
      selectedTimer.current.stop()
      cycle = cycleCount
    } else {
      setStart(true)
      selectedTimer.current.reset().start()
      console.log("task #"+cycle+" started")
    }
  }

  // function handleTaskDisplay(){
  //   setTaskDisplay(prev=>prev-1000)
  // }
  
  useEffect(() => {
    const taskTimer = new Timer(1000)
                          .action(()=>setTaskDisplay(prev=>prev-1000))
                          .repeat(taskDuration)
                          .done((t)=>{
                                      somePause(t, shortPauseTimer, longPauseTimer)
                                      setTaskDisplay(taskDuration * 1000)
                                    })
    const shortPauseTimer = pauseTimer("short", taskTimer)
    const longPauseTimer = pauseTimer("long", taskTimer)
    selectedTimer.current = taskTimer

    return ()=>{
      if(taskTimer) taskTimer.destroy()
      if(shortPauseTimer) shortPauseTimer.destroy()
      if(longPauseTimer) longPauseTimer.destroy()
    }

  }, [taskDuration, shortPauseDuration, longPauseDuration, start])


  return (
    <>
    <p>{taskDisplay}</p>
    <p>{shortPauseDisplay}</p>
    <p>{longPauseDisplay}</p>
    <p><input type="text" value={taskDuration} onChange={(e)=>setTaskDuration(e.target.value * 1)} /></p>
    <p><input type="text" value={shortPauseDuration} onChange={(e)=>setShortPauseDuration(e.target.value * 1)} /></p>
    <p><input type="text" value={longPauseDuration} onChange={(e)=>setLongPauseDuration(e.target.value * 1)} /></p>
    <p><button onClick={handlePause}>{isPaused ? 'resume' : 'pause'} timer</button></p>
    <p><button onClick={handleStart}>{start ? 'stop' : 'start'} timer</button></p>
    </>
  )
}

export default App
