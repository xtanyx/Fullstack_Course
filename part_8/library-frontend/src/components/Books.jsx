import { useQuery, useSubscription } from "@apollo/client"
import { BOOK_ADDED, BOOKS_BY_GENRE } from "../queries"
import { useState } from "react"

const Books = (props) => {
  const [genre, setGenre] = useState('all genres')
  const [genres, setGenres] = useState([])
  // const resultAllBooks = useQuery(ALL_BOOKS)
  const {loading, error, data, refetch} = useQuery(BOOKS_BY_GENRE, {
    variables: {genre},
  })

  useSubscription(BOOK_ADDED, {
    onData: ({data}) => {
      refetch({genres: genre})
    }
  })
  
  if (!props.show) {
    return null
  }

  if(loading){
    return <div>loading...</div>
  }

  // refetch({genres: genre})

  const books = data.booksByGenre
  const test = books.map(book => book.genres).flat(Infinity)
  for(const g of test) {
    if (!genres.includes(g)) {
      setGenres(genres.concat(g))
    }
  }
  console.log(genre)
  console.log(books)

  return (
    <div>
      <h2>books</h2>
      in genre {genre}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {
          genres.map((g) => {
            return <button key={g} onClick={() => {
              setGenre(g)
              refetch({genre: genre})
            }}>{g}</button>
          })
        }
        <button onClick={() => {
          setGenre('all genres')
          // refetch({genres: genre})
        }}>all genres</button>
      </div>
    </div>
  )
}

export default Books
