import { useQuery, useMutation } from "@apollo/client"
import { ALL_AUTHORS, ALL_BOOKS, EDIT_AUTHOR } from "../queries"
import { useState } from "react"

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  console.log(result)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [changeBorn] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}, {query: ALL_BOOKS}]
  })
  
  if (!props.show) {
    return null
  }

  

  if(result.loading){
    return <div>loading...</div>
  }

  const handleOnSetBorn = async(event) => {
    await changeBorn({variables: {name, setBornTo: Number(born)}})
    setName('')
    setBorn('')
  }
  
  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {
       props.token !== null
        ? <div>
            <h3>Set birthyear</h3>
            <div>
              <select onChange={({target}) => setName(target.value)}>
                {authors.map(author => <option key={author.name}>{author.name}</option>)}
              </select>
              <div>
                born
                <input
                  value={born}
                  onChange={({target}) => setBorn(target.value)}
                />
              </div>
              <button onClick={handleOnSetBorn}>update author</button>
            </div>
        </div>
        : null
      }
    </div>
  )
}

export default Authors
