import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(e) {
      window.alert('Invalid credentials')
    }
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
      <p>{user.name} logged in</p>
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