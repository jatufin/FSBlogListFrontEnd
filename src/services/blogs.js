import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)

  return response.data
}

const update = async updatedObject => {
  const url = `${baseUrl}/${updatedObject.id}`

  const objectToSend = {
    title: updatedObject.title,
    author: updatedObject.author,
    url: updatedObject.url,
    likes: updatedObject.likes,
    user: updatedObject.user
  }

  const response = await axios.put(url, objectToSend)

  return response.data
}

export default {
  setToken,
  getAll,
  create,
  update
}