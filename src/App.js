import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const LOGGED_USER = 'loggedOnBlogsAppuser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
    } catch(e) {
      window.alert('Invalid credentials')
    }
  } 

  const handleLogout = async () => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  const loginPage = () => (
    <div>
      <h2>log in to application</h2>
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
      <p>{user.name} logged in
      <button onClick={() => {handleLogout()}}>logout</button>
      </p>
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