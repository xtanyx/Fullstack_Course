import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api'

  useEffect(() => {
    if (name !== '') {
      axios
        .get(`${baseURL}/name/${name}`)
        .then(response => response.data)
        .then(response => {
          setCountry({found: true, response})
        })
        .catch(error => {
          setCountry({found: false, error})
        })
    }
    else {
      setCountry(null)
    }
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.response.name.common} </h3>
      <div>capital {country.response.capital[0]} </div>
      <div>population {country.response.population}</div> 
      <img src={country.response.flags.png} height='100' alt={`flag of ${country.response.name.local}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App