import { useState, useRef } from 'react'
import { useTimer } from './hooks/useTimer'
import { InputNumber } from './components/InputNumber'
import { InputRadio } from './components/InputRadio'
import './assets/styles/sass/main.scss'

function App() {
  const isUnitMinute = true
  const [taskDuration, setTaskDuration] = useState(25 * (isUnitMinute ? 60 : 1))
  const [taskDisplay, setTaskDisplay] = useState(taskDuration)
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * (isUnitMinute ? 60 : 1))
  const [shortBreakDisplay, setShortBreakDisplay] = useState(shortBreakDuration)
  const [longBreakDuration, setLongBreakDuration] = useState(15 * (isUnitMinute ? 60 : 1))
  const [longBreakDisplay, setLongBreakDisplay] = useState(longBreakDuration)
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const dialogBox = useRef(null)

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
      const minutes = Math.floor(num / 60)
      const seconds = num % 60
      return (minutes<10 ? "0" : "") + minutes + ":" + (seconds<10 ? "0" : "") + seconds
    }
    return num
  }

  function whichClock() {
    switch (activeTimer) {
      case 1: return taskDisplay
      case 2: return shortBreakDisplay
      case 3: return longBreakDisplay
    }
  }

  function progression() {
    switch (activeTimer) {
      case 1: return (taskDisplay / taskDuration) * 100
      case 2: return (shortBreakDisplay / shortBreakDuration) * 100
      case 3: return (longBreakDisplay / longBreakDuration) * 100
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const task_value = formData.get("task_value") * (isUnitMinute ? 60 : 1)
    const short_break_value = formData.get("short_break_value") * (isUnitMinute ? 60 : 1)
    const long_break_value = formData.get("long_break_value") * (isUnitMinute ? 60 : 1)

    if (task_value !== taskDuration) {
      setTaskDuration(task_value)
      setTaskDisplay(task_value)
    }
    if (short_break_value !== shortBreakDuration) {
      setShortBreakDuration(short_break_value)
      setShortBreakDisplay(short_break_value)
    }
    if (long_break_value !== longBreakDuration) {
      setLongBreakDuration(long_break_value)
      setLongBreakDisplay(long_break_value)
    }

    toggleDialog()
  }

  function toggleDialog() {
    setDialogIsOpen(!dialogIsOpen)
    dialogIsOpen ? dialogBox.current.close() : dialogBox.current.showModal()
  }

  return (
    <>
      <div className='container'>
        <div className='container__top'>
          <h1>Pomodoro</h1>
          <ul className='timer-steps'>
            <li className={`timer-steps__step ${(activeTimer === 1) && 'timer-steps__step--active'}`}>Pomodoro</li>
            <li className={`timer-steps__step ${(activeTimer === 2) && 'timer-steps__step--active'}`}>Short break</li>
            <li className={`timer-steps__step ${(activeTimer === 3) && 'timer-steps__step--active'}`}>Long break</li>
          </ul>
        </div>
        <div className="clock">
          <div className='clock__disc'>
            <div className='clock__hand' style={{ background: `conic-gradient(var(--chosen-color) ${progression()}%, transparent ${progression()}%) no-repeat` }}>
            </div>
            <button className='clock__button clock__button--start' onClick={handleStart}>&nbsp;{start ? 'stop' : 'start'}</button>
            <p className='clock__numeric'>{clockDisplay(whichClock())}</p>
            <button className='clock__button clock__button--pause' onClick={handleIsPaused}>&nbsp;{isPaused && start ? 'resume' : 'pause'}</button>
          </div>
        </div>
        <button type='button' className='button-setting' onClick={toggleDialog}>
          <svg className='button-setting__icon' xmlns="http://www.w3.org/2000/svg" width="28" height="28">
            <path d="M26.965 17.682l-2.927-2.317c.055-.448.097-.903.097-1.365 0-.462-.042-.917-.097-1.365l2.934-2.317a.702.702 0 00.167-.896l-2.775-4.851a.683.683 0 00-.847-.301l-3.454 1.407a10.506 10.506 0 00-2.345-1.379l-.52-3.71A.716.716 0 0016.503 0h-5.55a.703.703 0 00-.687.588l-.52 3.71c-.847.357-1.63.819-2.345 1.379L3.947 4.27a.691.691 0 00-.847.301L.325 9.422a.705.705 0 00.167.896l2.927 2.317c-.055.448-.097.903-.097 1.365 0 .462.042.917.097 1.365L.492 17.682a.702.702 0 00-.167.896L3.1 23.429a.683.683 0 00.847.301L7.4 22.323a10.506 10.506 0 002.345 1.379l.52 3.71c.056.329.34.588.687.588h5.55a.703.703 0 00.687-.588l.52-3.71c.847-.357 1.631-.819 2.346-1.379l3.454 1.407c.313.119.673 0 .847-.301l2.775-4.851a.705.705 0 00-.167-.896zM13.73 18.9c-2.685 0-4.857-2.191-4.857-4.9 0-2.709 2.172-4.9 4.857-4.9 2.684 0 4.856 2.191 4.856 4.9 0 2.71-2.172 4.9-4.856 4.9z" />
          </svg>
          <span className="sr-only">open the setting dialog box</span>
        </button>
      </div>
      <dialog className='dialog-setting' ref={dialogBox}>
        <div className="dialog-setting__background">
          <div className="dialog-setting__header">
            <h2 className='dialog-setting__title'>Setting</h2>
            <button type='button' className='dialog-setting__button-close' onClick={toggleDialog}>
              <svg className='dialog-setting__button-close__icon' xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                <path fillRule="evenodd" d="M11.95.636l1.414 1.414L8.414 7l4.95 4.95-1.414 1.414L7 8.414l-4.95 4.95L.636 11.95 5.586 7 .636 2.05 2.05.636 7 5.586l4.95-4.95z" />
              </svg>
            </button>
          </div>
          <form className='form-setting' onSubmit={handleSubmit}>
            <div className="form-setting__block">
              <fieldset className='form-setting__fieldset'>
                <legend className='form-setting__legend'>Time ({isUnitMinute ? "minutes" : "seconds"})</legend>
                <div className='form-setting__time'>
                  <label className='form-setting__time-label' htmlFor='task_value'>pomodoro</label>
                  <InputNumber inputId={'task_value'} name={'task_value'} defaultValue={taskDuration / (isUnitMinute ? 60 : 1)} />
                  <label className='form-setting__time-label' htmlFor='short_break_value'>short break</label>
                  <InputNumber inputId={'short_break_value'} name={'short_break_value'} defaultValue={shortBreakDuration / (isUnitMinute ? 60 : 1)} />
                  <label className='form-setting__time-label' htmlFor='long_break_value'>long break</label>
                  <InputNumber inputId={'long_break_value'} name={'long_break_value'} defaultValue={longBreakDuration / (isUnitMinute ? 60 : 1)} />
                </div>
              </fieldset>
            </div>
            <div className="form-setting__block form-setting__block--radio">
              <fieldset className='form-setting__fieldset'>
                <legend className='form-setting__legend'>Font</legend>
                <div className="form-setting__radio-group">
                  <InputRadio isFont={true} cat='A' checked={true} />
                  <InputRadio isFont={true} cat='B' />
                  <InputRadio isFont={true} cat='C' />
                </div>
              </fieldset>
            </div>
            <div className="form-setting__block form-setting__block--radio">
              <fieldset className='form-setting__fieldset'>
                <legend className='form-setting__legend'>Color</legend>
                <div className="form-setting__radio-group">
                  <InputRadio isFont={false} cat='A' checked={true} />
                  <InputRadio isFont={false} cat='B' />
                  <InputRadio isFont={false} cat='C' />
                </div>
              </fieldset>
            </div>
            <button className='form-setting__submit' type='submit'>Apply</button>
          </form>
        </div>
      </dialog>
    </>
  )
}

export default App
