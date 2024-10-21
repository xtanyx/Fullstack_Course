import Country from './Country'
import Weather from './Weather'

const Display = ({numCountry, countries, handleOnClick, weatherData}) => {
    if (numCountry === 1) {
      return (
      <div>
        <Country country={countries[0]}/>
        {
          weatherData === null ? null : <Weather weatherData={weatherData} capitalName={countries[0].capital[0]}/>
        }
        
      </div>)
    }
    else if(numCountry <= 10) {
      return (
        <div>
          {countries.map((country) => {
            if(country.toShow){
              return (
                <div key={country.cioc}>
                  {country.name.common} {}
                  <button onClick={() => handleOnClick(country.cioc)}>show</button>
                  <Country country={country}/>
                </div>
              )
            }
            else {
              return (
                <div key={country.cioc}>
                  {country.name.common} {}
                  <button onClick={() => handleOnClick(country.cioc)}>show</button>
                </div>
              )
            }
          } 
          )}
        </div>
      )
    }
    else {
      return <div>Too many matches, specify another filter</div>
    }    
}

export default Display