import React, { useState } from 'react'

const BlogForm = ({addBlog}) => {
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
        type='text'
        name='Title'
        onChange={({target}) => setTitle(target.value)}
      /></p>
      <p>author:<input
        type='text'
        name='Author'
        onChange={({target}) => setAuthor(target.value)}
      /></p>
      <p>url:<input
        type='text'
        name='url'
        onChange={({target}) => setUrl(target.value)}
      /></p>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm