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
      return Math.floor(num / 60) + ":" + num % 60
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

    if(task_value !== taskDuration) {
      setTaskDuration(task_value)
      setTaskDisplay(task_value)
    }
    if(short_break_value !== shortBreakDuration) {
      setShortBreakDuration(short_break_value)
      setShortBreakDisplay(short_break_value)
    }
    if(long_break_value !== longBreakDuration) {
      setLongBreakDuration(long_break_value)
      setLongBreakDisplay(long_break_value)
    }
  }

  return (
    <>
      <div className='container'>
        <h1>Pomodoro</h1>
        <ul className='timer-steps'>
          <li className={`timer-steps__step ${(activeTimer===1) && 'timer-steps__step--active'}`}>Pomodoro</li>
          <li className={`timer-steps__step ${(activeTimer===2) && 'timer-steps__step--active'}`}>Short break</li>
          <li className={`timer-steps__step ${(activeTimer===3) && 'timer-steps__step--active'}`}>Long break</li>
        </ul>
        <div className='clock'>
          <div className='clock__hand' style={{background:`conic-gradient(#48abe0 ${progression()}%, transparent ${progression()}%) no-repeat`}}>
          </div>
          <p className='clock__numeric'>{clockDisplay(whichClock())}</p>
        </div>
        <p><button className='button-timer' onClick={handleStart}>{start ? 'stop' : 'start'} timer</button></p>
        <p><button className='button-timer' onClick={handleIsPaused}>{isPaused && start ? 'resume' : 'pause'} timer</button></p>
      </div>
      <div className='dialog-setting'>
        <h2 className='dialog-setting__title'>Setting</h2>
        <form className='form-setting' onSubmit={handleSubmit}>
          <fieldset>
            <legend className='form-setting__legend'>Time ({isUnitMinute ? "minutes" : "seconds"})</legend>
            <p><label className='form-setting__time-label' htmlFor='task_value'>pomodoro</label>: <input className='form-setting__time-input' type='number' min={1} max={59} id='task_value' name='task_value' defaultValue={taskDuration / (isUnitMinute ? 60 : 1)} /></p>
            <p><label className='form-setting__time-label' htmlFor='short_break_value'>short break</label>: <input className='form-setting__time-input' type='number' min={1} max={59} id='short_break_value' name='short_break_value' defaultValue={shortBreakDuration / (isUnitMinute ? 60 : 1)} /></p>
            <p><label className='form-setting__time-label' htmlFor='long_break_value'>long break</label>: <input className='form-setting__time-input' type='number' min={1} max={59} id='long_break_value' name='long_break_value' defaultValue={longBreakDuration / (isUnitMinute ? 60 : 1)} /></p>
          </fieldset>
          <fieldset>
            <legend className='form-setting__legend'>Font</legend>
            <p><label className='form-setting__font-label form-setting__font-label--A' htmlFor='font_A'>Aa</label>: <input type='radio' value='A' defaultChecked name='font_category' id='font_A' /></p>
            <p><label className='form-setting__font-label form-setting__font-label--B' htmlFor='font_B'>Aa</label>: <input type='radio' value='B' name='font_category' id='font_B' /></p>
            <p><label className='form-setting__font-label form-setting__font-label--C' htmlFor='font_C'>Aa</label>: <input type='radio' value='C' name='font_category' id='font_C' /></p>
          </fieldset>
          <button className='form-setting__submit' type='submit'>Apply</button>
        </form>
      </div>
    </>
  )
}

export default App
