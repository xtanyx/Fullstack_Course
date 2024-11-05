import { createAnecdote } from "../requests"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['anecdotes']})
    },
    onError: () => {
      notificationDispatch({type: 'NEW_NOTIFICATION', payload: 'too short anecdote, must have length 5 or more'})
      setTimeout(() => {
        notificationDispatch({type: 'NEW_NOTIFICATION', payload: null})
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate({content, votes: 0})
    notificationDispatch({type: 'NEW_NOTIFICATION', payload: `anecdote '${content}' created`})
    setTimeout(() => {
      notificationDispatch({type: 'NEW_NOTIFICATION', payload: null})
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
