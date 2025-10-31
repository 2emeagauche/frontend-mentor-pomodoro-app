import { useState } from 'react'
import { useTimer } from './useTimer'
import './assets/styles/sass/main.scss'

function App() {
  const isUnitMinute = true
  const [taskDuration, setTaskDuration] = useState(5 * (isUnitMinute ? 60 : 1))
  const [taskDisplay, setTaskDisplay] = useState(taskDuration)
  const [shortBreakDuration, setShortBreakDuration] = useState(3 * (isUnitMinute ? 60 : 1))
  const [shortBreakDisplay, setShortBreakDisplay] = useState(shortBreakDuration)
  const [longBreakDuration, setLongBreakDuration] = useState(5 * (isUnitMinute ? 60 : 1))
  const [longBreakDisplay, setLongBreakDisplay] = useState(longBreakDuration)


  const { isPaused, start, handleStart, handleIsPaused, activeTimer } = useTimer(
    {
      taskDuration,
      shortBreakDuration,
      longBreakDuration,
      setTaskDisplay,
      setShortBreakDisplay,
      setLongBreakDisplay,
    }
  )


  function clockDisplay(num) {
    if (isUnitMinute) {
      return Math.floor(num / 60) + " : " + num % 60
    }
    return num
  }

  function whichClock(){
    switch(activeTimer){
      case 1: return taskDisplay
      case 2: return shortBreakDisplay
      case 3: return longBreakDisplay
    }
  }
  
  function progression() {
    switch(activeTimer){
      case 1: return (taskDisplay / taskDuration)*100
      case 2: return (shortBreakDisplay / shortBreakDuration)*100
      case 3: return (longBreakDisplay / longBreakDuration)*100
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const task_value = formData.get("task_value") * (isUnitMinute ? 60 : 1)
    const short_break_value = formData.get("short_break_value") * (isUnitMinute ? 60 : 1)
    const long_break_value = formData.get("long_break_value") * (isUnitMinute ? 60 : 1)

    setTaskDuration(task_value)
    setTaskDisplay(task_value)
    setShortBreakDuration(short_break_value)
    setShortBreakDisplay(short_break_value)
    setLongBreakDuration(long_break_value)
    setLongBreakDisplay(long_break_value)
  }

  return (
    <>
      <h1>Pomodoro App</h1>
      <h2>Clocks</h2>
      <p><span style={{color:activeTimer===1?'red':'black'}}>Pomodoro</span></p>
      <p><span style={{color:activeTimer===2?'red':'black'}}>Short break</span></p>
      <p><span style={{color:activeTimer===3?'red':'black'}}>Long break</span></p>
      <div className='clock'>
        <div className='clock__hand' style={{background:`conic-gradient(#48abe0 ${progression()}%, transparent ${progression()}%) no-repeat`}}>
        </div>
        <p className='clock__numeric'>{clockDisplay(whichClock())}</p>
      </div>
      <p><button onClick={handleStart}>{start ? 'stop' : 'start'} timer</button></p>
      <p><button onClick={handleIsPaused}>{isPaused && start ? 'resume' : 'pause'} timer</button></p>
      <h2>Setting time options (minutes)</h2>
      <form onSubmit={handleSubmit}>
        <p><label htmlFor="task_value">pomodoro</label>: <input type="number" id="task_value" name="task_value" defaultValue={taskDuration / (isUnitMinute ? 60 : 1)} /> {isUnitMinute ? "minutes" : "seconds"}</p>
        <p><label htmlFor="short_break_value">short break</label>: <input type="number" id="short_break_value" name="short_break_value" defaultValue={shortBreakDuration / (isUnitMinute ? 60 : 1)} /> {isUnitMinute ? "minutes" : "seconds"}</p>
        <p><label htmlFor="long_break_value">long break</label>: <input type="number" id="long_break_value" name="long_break_value" defaultValue={longBreakDuration / (isUnitMinute ? 60 : 1)} /> {isUnitMinute ? "minutes" : "seconds"}</p>
        <button type="submit">Apply</button>
      </form>
    </>
  )
}

export default App
