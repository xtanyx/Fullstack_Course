import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  console.log('bp1')
  console.log('bp0')
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog) => {
  console.log('bp2')
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const like = async (blog) => {
  console.log('bp3')
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
  return response.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }
  console.log('removing...')
  await axios.delete(`${baseUrl}/${blog.id}`, config)
}

export default { getAll, setToken, create, like, remove }