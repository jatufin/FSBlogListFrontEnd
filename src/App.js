import React, { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const LOGGED_USER = 'loggedOnBlogsAppuser'
const NOTIFICATION_TIMEOUT = 5000

const Notification = ({message, type}) => {
  if(!message) {
    return null
  }

  return(
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem(LOGGED_USER)

    if(userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setNotification(message)
    setNotificationType(type ? type : 'normal')

    setTimeout(() => {
      setNotification('')
    }, NOTIFICATION_TIMEOUT)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        LOGGED_USER,
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      showNotification('wrong username or password', 'error')
    }
  } 

  const handleLogout = async () => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const addedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(addedBlog))

      showNotification(
        `a new blog ${addedBlog.title} by ${addedBlog.author} added`,
        'normal'
      )
    } catch(error) {
      showNotification(
        `Failed to add blog: ${error.message}`,
        'error'
      )
    }

    
  }

  const loginPage = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={notification} type={notificationType}/>
      <form onSubmit={handleLogin}>
        <p><input
          type='text'
          name='Username'
          onChange={ ({target}) => setUsername(target.value)}
        /></p>
        <p><input
          type='password'
          name='Password'
          onChange={ ({target}) => setPassword(target.value)}
        /></p>
        <button type='submit'>login</button>
      </form>
    </div>
  )
  
  const blogsPage = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} type={notificationType}/>
      <p>{user.name} logged in
      <button onClick={() => {handleLogout()}}>logout</button>
      </p>
      
      <Togglable
        ref={blogFormRef}
        openButtonLabel='new note'
        closeButtonLabel='cancel'
      >
      <h2>create new</h2>
      <BlogForm addBlog={addBlog} />
      </Togglable>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
    { user === null
      ? loginPage()
      : blogsPage()
    }
    </div>
  )
}

export default App