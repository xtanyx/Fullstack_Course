import axios from 'axios'

const baseURl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => {
  return axios.get(baseURl).then(response => response.data)
}

export const createAnecdote = (anecdote) => {
  return axios.post(baseURl, anecdote).then(response => response.data)
}

export const voteAnecdote = (anecdote) => {
  return axios.put(`${baseURl}/${anecdote.id}`, anecdote).then(response => response.data)
}