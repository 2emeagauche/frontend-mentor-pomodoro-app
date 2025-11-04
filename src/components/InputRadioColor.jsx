export function InputRadioColor({cat, checked}){
  return (
    <label className='form-setting__custom-radio' htmlFor={`color_${cat}`}>
      <span className='sr-only'>choose color category {cat}</span>
      <input className={`form-setting__color-radio-input form-setting__color-radio-input--${cat}`} type='radio' value={cat} defaultChecked={checked} name='color_category' id={`color_${cat}`} />
      <svg className='form-setting__color-radio-tick' width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.707031 5.20709L4.65966 9.15972L13.1123 0.707092" stroke="#161932" strokeWidth="2"/>
      </svg>  
    </label>
  )
}