import { useState } from "react"

export function InputNumber({inputId, name, defaultValue}){
  
  const [value, setValue] = useState(defaultValue);

  const maxValue = 59

  const minValue = 1

  const increment = () => {
    setValue(prev => {
      if(prev === maxValue) {
        return prev
      }
      return prev + 1
    });
  };

  const decrement = () => {
    setValue(prev => {
      if(prev === minValue) {
        return prev
      }
      return prev - 1
    });
  };

  const handleChange = (e) => {
    let val = e.target.value === '' ? defaultValue : Number(e.target.value)
    val = (val > maxValue) ? maxValue : (val < minValue) ? minValue : val;
    setValue(val);
  };

  return (
    <div className="form-setting__time-input-wrapper">
        <input type="number" className="form-setting__time-input" min={1} max={59} id={inputId} name={name} value={value} onChange={handleChange} />
        <div className="time-input__arrow-buttons">
            <button className="time-input__arrow-button" id="incrementBtn" type="button" onClick={increment}>
              <svg className="time-input__arrow-button__icon" xmlns="http://www.w3.org/2000/svg" width="14" height="7">
                <path fill="none" strokeWidth="2" d="M1 6l6-4 6 4"/>
              </svg>
            </button>
            <button className="time-input__arrow-button" id="decrementBtn" type="button" onClick={decrement}>
              <svg className="time-input__arrow-button__icon" xmlns="http://www.w3.org/2000/svg" width="14" height="7">
                <path fill="none" stroke="#1E213F" strokeOpacity=".25" strokeWidth="2" d="M1 1l6 4 6-4"/>
              </svg>
            </button>
        </div>
    </div>
  )
}