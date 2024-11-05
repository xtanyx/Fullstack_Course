import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

const compareFn = (a, b) => {
  if (a.votes > b.votes) {
    return -1
  }
  else if (a.votes < b.votes) {
    return 1
  }
  return 0
}

const initialState = []

const anecdoteSlicer = createSlice({
  name: 'anecdote',
  initialState,
  reducers: {
    toVote(state, action) {
      const id = action.payload.id
      const updatedAnecdote = action.payload
      return (state.map(anecdote => anecdote.id === id ? updatedAnecdote : anecdote)).toSorted(compareFn)
    },
    appendAnecdote(state, action) {
      const anecdote = action.payload
      return [...state, anecdote]
    },
    setAnecdotes(state, action) {
      return action.payload.toSorted(compareFn)
    }
  }
})

export const {toVote, appendAnecdote, setAnecdotes} = anecdoteSlicer.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = (anecdote) => {
  return async (dispatch) => {
    const createdAnecdote = await anecdoteService.createAnecdote(anecdote)
    dispatch(appendAnecdote(createdAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  const updatedAnecdote = {
    content: anecdote.content,
    id: anecdote.id,
    votes: anecdote.votes + 1
  }

  return async (dispatch) => {
    const newAnecdote = await anecdoteService.updateAnecdote(updatedAnecdote)
    dispatch(toVote(newAnecdote))
  }
}

export default anecdoteSlicer.reducer