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
  const [isStoped, setIsStoped] = useState(new Date())

  const selectedTimer = useRef(null)
  const cycleCount = 4
  let cycle = cycleCount

  function somePause(t, shortBreakTimer, longBreakTimer) {
    t.stop()
    --cycle
    if (cycle > 0) {
      shortBreakTimer.reset().start()
      selectedTimer.current = shortBreakTimer
    } else {
      longBreakTimer.reset().start()
      selectedTimer.current = longBreakTimer
      cycle = cycleCount
    }
  }

  function breakFinished(t, nextTimer) {
    t.stop()
    nextTimer.reset().start()
    selectedTimer.current = nextTimer
  }

  function breakTimeHandler(type, nextTimer) {
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
        breakFinished(t, nextTimer, type)
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
      selectedTimer.current.stop()
      cycle = cycleCount
      setIsStoped(new Date())
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
    console.log("fresh")
    const taskTimer = new Timer(1000)
      .action(handleSetTaskDisplay)
      .repeat(taskDuration)
      .done((t) => {
        somePause(t, shortBreakTimer, longBreakTimer)
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

  }, [taskDuration, shortBreakDuration, longBreakDuration, isStoped])


  return {
    isPaused,
    start,
    handleStart,
    handleIsPaused,
  }
}

