export function InputRadioFont({cat, checked}){
  return (
    <label className='form-setting__custom-radio' htmlFor={`font_${cat}`}>
      <span className='sr-only'>choose font category {cat}</span>
      <input className='form-setting__font-radio-input' type='radio' value={cat} defaultChecked={checked} name='font_category' id={`font_${cat}`} />
      <div className={`form-setting__font-preview form-setting__font-preview--${cat}`}>Aa</div>
    </label>
  )
}