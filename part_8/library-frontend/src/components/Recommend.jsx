import { useQuery } from "@apollo/client"
import { BOOKS_BY_GENRE, ME } from "../queries"
import { useEffect, useState } from "react"

const Recommend = (props) => {
  const [genre, setGenre] = useState('')
  const result = useQuery(ME)
  const {loading, error, data, refetch} = useQuery(BOOKS_BY_GENRE, {
    variables: {genre}
  })

  useEffect(() => {
    if(result.data){
      setGenre(result.data.me.favoriteGenre)
      console.log('genre',genre)
      refetch({genre: genre})
    }
  }, [result.data])

  if(!props.show){
    return null
  }

  if(result.loading || loading) {
    return <div>loading...</div>
  }

  if(!result.data.me.favoriteGenre){
    return <div>No favorite genre</div>
  }

  return(
    <div>
      <h2>recommendations</h2>
      <table>
        <caption>
        books in your favorite genre <strong>{result.data.me.favoriteGenre}</strong>
        </caption>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {data.booksByGenre.map(book => 
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend