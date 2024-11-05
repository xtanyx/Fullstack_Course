import { useDispatch } from "react-redux"
import { addAnecdote } from "../reducers/anecdoteReducer"
import { setNotification} from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleAddAnecdote = async (event) => {
    event.preventDefault()

    const newAnecdote = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(newAnecdote))
    dispatch(setNotification(`you added '${newAnecdote}'`, 5))
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={handleAddAnecdote}>
        <div>
          <input name='anecdote'/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm