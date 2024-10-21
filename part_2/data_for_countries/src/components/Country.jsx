const Country = ({country}) => {
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>
          <li>capital {country.capital[0]}</li>
          <li>area {country.area}</li>
        </p>
        <strong>languages:</strong>
        <ul>
          {
            Object.entries(country.languages).map((language) => <li key={language[0]}>{language[1]}</li>)
          }
        </ul>
        <img src={country.flags.png}></img>
      </div>
    )
}

export default Country

