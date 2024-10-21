import { useState, useEffect } from "react"
import axios from 'axios'
import Display from './components/Display'

const App = () => {
  const [newCountry, setNewCountry] = useState('')
  const [numCountry, setNumCountry] = useState(0)
  const [countries, setCountries] = useState([])
  const [weatherData, setWeatherData] = useState(null)

  const api_key = import.meta.env.VITE_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        return response.data.filter((country) => country.name.common.toLowerCase().includes(newCountry.toLowerCase()))
      })
      .then((response) => {
        return response.map((country) => ({...country, toShow: false}))
      })
      .then((response) => {
        console.log(response)
        setCountries(response)
        setNumCountry(response.length)
      })
  }, [newCountry])

  useEffect(() => {
    if(numCountry === 1){
      if(weatherData === null){
        axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${countries[0].capitalInfo.latlng[0]}&lon=${countries[0].capitalInfo.latlng[1]}&appid=${api_key}`)
        .then((response) => {
          console.log(response)
          setWeatherData(response.data)
        })
      }
    }
    else {
      if(weatherData !== null){
        setWeatherData(null)
      }
    }
  }, [newCountry])

  const handleOnClick = (cioc) => {
    const showCountry = countries.filter((country) => country.cioc === cioc)[0]
    const toShow = showCountry.toShow
    setCountries(countries.filter((country) => country.cioc !== cioc).concat({...showCountry, toShow: !toShow}))
  }

  const handleOnChange = (event) => {
    setNewCountry(event.target.value)
  }

  return (
    <div>
      <label htmlFor="country">find countries </label>
      <input id="country" onChange={handleOnChange}></input>
      <Display numCountry={numCountry} countries={countries} 
                handleOnClick={handleOnClick} weatherData={weatherData}/>
    </div>
  )
}

export default App
