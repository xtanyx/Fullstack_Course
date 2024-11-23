const Person = ({person, handleOnDelete}) => {
    return (
      <li>
        {person.name} {person.number} {' '}
        <button onClick={() => handleOnDelete(person.id)}>delete</button>
      </li>

    )
}

const Persons = ({displaypersons, handleOnDelete}) => {
    // console.log(displaypersons)
    return (
        <p>
            {displaypersons.map(person => <Person key={person.id} person={person} handleOnDelete={handleOnDelete}/>)}
        </p>
    )
}

export default Persons