import axios from "axios";

const baseURL = '/api/users'

const getUsers = () => {
  const response = axios.get(baseURL)
  return response.then((res) => res.data)
}

export default {getUsers}