import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    if (event.type === 'change') {
      setValue(event.target.value)
    }
    else if (event.type === 'reset') {
      setValue('')
    } 
  }

  return {
    type,
    value,
    onChange
  }
}