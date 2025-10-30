import { useState } from 'react'
import { useTimer } from './useTimer'
import './App.css'

function App() {
  const [taskDuration, setTaskDuration] = useState(5)
  const [taskDisplay, setTaskDisplay] = useState(taskDuration * 1000)
  const [shortBreakDuration, setShortBreakDuration] = useState(3)
  const [shortBreakDisplay, setShortBreakDisplay] = useState(shortBreakDuration * 1000)
  const [longBreakDuration, setLongBreakDuration] = useState(5)
  const [longBreakDisplay, setLongBreakDisplay] = useState(longBreakDuration * 1000)

  const {
    isPaused,
    start,
    handleStart,
    handleIsPaused,
  } = useTimer(
      {
        taskDuration,
        shortBreakDuration,
        longBreakDuration,
        setTaskDisplay,
        setShortBreakDisplay,
        setLongBreakDisplay
      }
    )

  function handleSubmit(e){
    e.preventDefault()
    const formData = new FormData(e.target)
    const task_value = formData.get("task_value")
    const short_break_value = formData.get("short_break_value")
    const long_break_value = formData.get("long_break_value")

    setTaskDuration(task_value * 1)
    setShortBreakDuration(short_break_value * 1)
    setLongBreakDuration(long_break_value * 1)
    setTaskDisplay(task_value * 1000)
    setShortBreakDisplay(short_break_value * 1000)
    setLongBreakDisplay(long_break_value * 1000)
  }

  return (
    <>
      <h1>Pomodoro App</h1>
      <h2>Clocks</h2>
      <p>Pomodoro clock: {taskDisplay}</p>
      <p>Short break clock: {shortBreakDisplay}</p>
      <p>Long break clock: {longBreakDisplay}</p>
      <p><button onClick={handleStart}>{start ? 'stop' : 'start'} timer</button></p>
      <p><button onClick={handleIsPaused}>{isPaused ? 'resume' : 'pause'} timer</button></p>
      <h2>Setting time options (minutes)</h2>
      <form onSubmit={handleSubmit}>
        <p><label htmlFor="task_value">pomodoro</label>: <input type="text" id="task_value" name="task_value" defaultValue={taskDuration} /> minutes</p>
        <p><label htmlFor="short_break_value">short break</label>: <input type="text" id="short_break_value" name="short_break_value" defaultValue={shortBreakDuration} /> minutes</p>
        <p><label htmlFor="long_break_value">long break</label>: <input type="text" id="long_break_value" name="long_break_value" defaultValue={longBreakDuration} /> minutes</p>
        <button type="submit">Apply</button>
      </form>
    </>
  )
}

export default App
