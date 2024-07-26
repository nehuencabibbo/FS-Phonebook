import axios from "axios"
const baseUrl = '/api/persons'


const add = (newPerson) => {
    return axios
            .post(baseUrl, newPerson)
            .then(response => response.data)
}

const getAll = () => {
    return axios
            .get(baseUrl)
            .then(response => response.data)
}

const remove = (id) => {
    return axios    
        .delete(baseUrl + '/' + id)
        .then(response => response.data)
}   

const change = (id, person) => {
    return axios
        .put(`${baseUrl}/${id}`, person)
        .then(response => response.data)
}

export default {
    add,
    getAll,
    remove,
    change
}

