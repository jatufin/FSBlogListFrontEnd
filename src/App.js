import Config from './config'

import React, { useState, useEffect, useRef } from 'react'

import Blogs from './components/Blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

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

  useEffect(() => {
    const userJSON = window.localStorage.getItem(Config.STORAGE_KEY)

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
    }, Config.NOTIFICATION_TIMEOUT)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      console.log('Talletaan avaimella', Config.STORAGE_KEY)

      window.localStorage.setItem(
        Config.STORAGE_KEY,
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
      addedBlog.user = {
        username: user.username,
        name: user.name
      }

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

  const updateBlog = async (blogObject) => {
    const updatedBlog = await blogService.update(blogObject)
    updatedBlog.user = {
      username: blogObject.user.username,
      name: blogObject.user.name
    }

    setBlogs(blogs.map(b =>
      b.id !== updatedBlog.id
        ? b
        : updatedBlog))
  }

  const removeBlog = async (blogObject) => {
    if(!window.confirm(`remove ${blogObject.title} by ${blogObject.author}`)) {
      return
    }

    try {
      await blogService.remove(blogObject, user.token)

      setBlogs(blogs.filter(b => b.id !== blogObject.id))

      showNotification('blog removed')
    } catch(error) {
      showNotification(
        `Failed to remove blog: ${error.message}`,
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
          id='username'
          type='text'
          onChange={ ({ target }) => setUsername(target.value)}
        /></p>
        <p><input
          id='password'
          type='password'
          onChange={ ({ target }) => setPassword(target.value)}
        /></p>
        <button id='login-button' type='submit'>login</button>
      </form>
    </div>
  )

  const blogsPage = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} type={notificationType}/>
      <p>{user.name} logged in
        <button id='logout-button' onClick={() => {handleLogout()}}>logout</button>
      </p>

      <Togglable
        ref={blogFormRef}
        openButtonLabel='create new blog'
        closeButtonLabel='cancel'
      >
        <h2>create new</h2>
        <BlogForm addBlog={addBlog} />
      </Togglable>

      <Blogs
        blogs={blogs}
        updateBlog={updateBlog}
        removeBlog={removeBlog}
        currentUser={user}/>
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