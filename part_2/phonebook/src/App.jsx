import { useEffect, useState } from 'react'
import phonebookService from './services/phonebook'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [toFilter,setToFilter] = useState(false)
  const [notification, setNotification] = useState(null)
  const [notificationSuccess, setNotificationSuccess] = useState(true)

  useEffect(() => {
    // console.log('effecto')
    phonebookService
      .getAll()
      .then(personsData => {
        // console.log('promiso')
        setPersons(personsData)
      })
  }, [])

  const handleOnDelete = (id) => {
    const toDelete = window.confirm(`Delete ${persons.find(person => person.id === id).name}`)
    if (toDelete) {
      phonebookService
        .remove(id)
        .then(data => {
          setPersons(persons.filter(person => person.id !== data.id))
          setNotificationSuccess(true)
          setNotification(`${persons.find(person => person.id === id).name} deleted from phonebook`)
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
    } 
  }

  const handleOnChangeFilter = (event) => {
    setFilter(event.target.value)
    if(event.target.value !== '')
      setToFilter(true)
  }

  const handleOnChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleOnChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleOnSubmit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    const stringified_names = persons.map(person => person.name.toLowerCase())

    if (stringified_names.indexOf(newPerson.name.toLowerCase()) === -1){
      phonebookService
        .create(newPerson)
        .then((personData) => {
          setNotificationSuccess(true)
          setPersons(persons.concat(personData))
          setNotification(`Added ${personData.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
    }
    else {
      const toReplace = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (toReplace){
        const getPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
        const updatedPerson = {...getPerson, number: newNumber}
        phonebookService
          .replace(getPerson.id, updatedPerson)
          .then(personData => {
            setPersons(persons.filter(person => person.id !== personData.id).concat(personData))
            setNotification(`Updated ${personData.name}`)
            setTimeout(() => setNotification(null), 3000)
          })
          .catch(error => {
            setNotificationSuccess(false)
            setNotification(`Information of ${newPerson.name} has already been deleted from the server`)
            setTimeout(() => {
              setNotification(null)
            }, 3000)
            setPersons(persons.filter(person => person.name.toLowerCase() !== newPerson.name.toLocaleLowerCase()))
          })
      }
    }

    setNewName('')
    setNewNumber('')
  }

  //Convert the filter string and person.name into lowercase and check if filter is a part of person.name
  const displaypersons = !toFilter ? 
                          persons : 
                          persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleOnChangeFilter={handleOnChangeFilter}/>

      <Notification message={notification} isSuccess={notificationSuccess}/>

      <h2>add a new</h2>
      <PersonForm handleOnSubmit={handleOnSubmit} 
                  handleOnChangeName={handleOnChangeName} 
                  handleOnChangeNumber={handleOnChangeNumber}
                  newName={newName}
                  newNumber={newNumber}/>

      <h2>Numbers</h2>
      <Persons displaypersons={displaypersons} handleOnDelete={handleOnDelete}/>
    </div>
  )
}

export default App
