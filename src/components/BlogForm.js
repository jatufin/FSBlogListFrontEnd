import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title,
      author,
      url
    }

    addBlog(blogObject)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleNewBlog}>
      <p>title:<input
        id='title'
        type='text'
        onChange={({ target }) => setTitle(target.value)}
      /></p>
      <p>author:<input
        id='author'
        type='text'
        onChange={({ target }) => setAuthor(target.value)}
      /></p>
      <p>url:<input
        id='url'
        type='text'
        onChange={({ target }) => setUrl(target.value)}
      /></p>
      <button id='blog-submit' type='submit'>create</button>
    </form>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogForm