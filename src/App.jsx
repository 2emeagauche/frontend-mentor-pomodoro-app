import { useState } from 'react'
import { useTimer } from './useTimer'
import './assets/styles/sass/main.scss'

function App() {
  const isUnitMinute = false
  const [taskDuration, setTaskDuration] = useState(5 * (isUnitMinute ? 60 : 1))
  const [taskDisplay, setTaskDisplay] = useState(taskDuration)
  const [shortBreakDuration, setShortBreakDuration] = useState(3 * (isUnitMinute ? 60 : 1))
  const [shortBreakDisplay, setShortBreakDisplay] = useState(shortBreakDuration)
  const [longBreakDuration, setLongBreakDuration] = useState(5 * (isUnitMinute ? 60 : 1))
  const [longBreakDisplay, setLongBreakDisplay] = useState(longBreakDuration)


  const { isPaused, start, handleStart, handleIsPaused } = useTimer(
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
    if(isUnitMinute){
      return Math.floor(num/60)+" : "+num%60
    }
    return num
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const task_value = formData.get("task_value")
    const short_break_value = formData.get("short_break_value")
    const long_break_value = formData.get("long_break_value")

    setTaskDuration(task_value * (isUnitMinute ? 60 : 1))
    setTaskDisplay(task_value * (isUnitMinute ? 60 : 1))
    setShortBreakDuration(short_break_value * (isUnitMinute ? 60 : 1))
    setShortBreakDisplay(short_break_value * (isUnitMinute ? 60 : 1))
    setLongBreakDuration(long_break_value * (isUnitMinute ? 60 : 1))
    setLongBreakDisplay(long_break_value * (isUnitMinute ? 60 : 1))
  }

  return (
    <>
      <h1>Pomodoro App</h1>
      <h2>Clocks</h2>
      <p>Pomodoro clock: {clockDisplay(taskDisplay)}</p>
      <p>Short break clock: {clockDisplay(shortBreakDisplay)}</p>
      <p>Long break clock: {clockDisplay(longBreakDisplay)}</p>
      <p><button onClick={handleStart}>{start ? 'stop' : 'start'} timer</button></p>
      <p><button onClick={handleIsPaused}>{isPaused ? 'resume' : 'pause'} timer</button></p>
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
