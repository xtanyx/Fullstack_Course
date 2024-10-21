const Weather = ({weatherData, capitalName}) => {
    return (
        <div>
            <h2>Weather in {capitalName}</h2>
            <p>temperature: {(weatherData.main.temp - 273.1).toFixed(2)} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}></img>
            <p>wind {weatherData.wind.speed} m/s</p>
        </div>
    )
}

export default Weather