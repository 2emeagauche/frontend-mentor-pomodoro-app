import { useState, useEffect, useRef } from 'react'
import Timer from 'advanced-timer'

export function useTimer(
  {
    taskDuration,
    shortBreakDuration,
    longBreakDuration,
    setTaskDisplay,
    setShortBreakDisplay,
    setLongBreakDisplay,
  }
) {

  const [isPaused, setIsPaused] = useState(false)
  const [start, setStart] = useState(false)
  const [activeTimer, setActiveTimer] = useState(1)
  const [isStopped, setIsStopped] = useState(new Date())

  const selectedTimer = useRef(null)
  const cycleCount = 4
  const cycle = useRef(cycleCount)

  function someBreak(t, shortBreakTimer, longBreakTimer) {
    t.resume().stop()
    --cycle.current
    if (cycle.current > 0) {
      setActiveTimer(2)
      shortBreakTimer.reset().start()
      selectedTimer.current = shortBreakTimer
    } else {
      setActiveTimer(3)
      longBreakTimer.reset().start()
      selectedTimer.current = longBreakTimer
      cycle.current = cycleCount
    }
  }

  function breakFinished(t, taskTimer) {
    t.resume().stop()
    setActiveTimer(1)
    taskTimer.reset().start()
    selectedTimer.current = taskTimer
  }

  function breakTimeHandler(type, taskTimer) {
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
      .action(() => breakOptions[type].setDisplay(prev => prev  - 1))
      .repeat(breakOptions[type].duration)
      .done((t) => {
        breakOptions[type].setDisplay(breakOptions[type].duration)
        breakFinished(t, taskTimer)
      })
  }

  function handleIsPaused() {
    if (isPaused) {
      setIsPaused(false)
      selectedTimer.current.resume()
    } else {
      setIsPaused(true)
      selectedTimer.current.pause()
    }
  }

  function handleStart() {
    if (start) {
      selectedTimer.current.resume().stop()
      cycle.current = cycleCount
      setIsStopped(new Date())
      setStart(false)
      setTaskDisplay(taskDuration)
      setShortBreakDisplay(shortBreakDuration)
      setLongBreakDisplay(longBreakDuration)
    } else {
      setStart(true)
      selectedTimer.current.start()
    }
  }

  function handleSetTaskDisplay() {
    setTaskDisplay(prev => prev - 1)
  }

  useEffect(() => {
    setActiveTimer(1)
    const taskTimer = new Timer(1000)
      .action(handleSetTaskDisplay)
      .repeat(taskDuration)
      .done((t) => {
        someBreak(t, shortBreakTimer, longBreakTimer)
        setTaskDisplay(taskDuration)
      })
    const shortBreakTimer = breakTimeHandler("short", taskTimer)
    const longBreakTimer = breakTimeHandler("long", taskTimer)
    selectedTimer.current = taskTimer

    return () => {
      if (taskTimer) {
        taskTimer.destroy()
      }
      if (shortBreakTimer) {
        shortBreakTimer.destroy()
      }
      if (longBreakTimer) {
        longBreakTimer.destroy()
      }
      selectedTimer.current = null
      setStart(false)
    }

  }, [taskDuration, shortBreakDuration, longBreakDuration, isStopped])


  return {
    isPaused,
    start,
    handleStart,
    handleIsPaused,
    activeTimer,
  }
}

