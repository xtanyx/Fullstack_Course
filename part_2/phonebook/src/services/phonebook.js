import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios
                .get(`${baseUrl}`)
                .then((response) => {
                    return response.data
                })
}

const create = (newObject) => {
    return axios
                .post(`${baseUrl}`,newObject)
                .then(response => response.data)
}

const remove = (id) => {
    return axios 
                .delete(`${baseUrl}/${id}`)
                .then(response => response.data)
}

const replace = (id,newObject) => {
    return axios
                .put(`${baseUrl}/${id}`, newObject)
                .then(response => response.data)
}

export default {getAll, create, remove, replace}