import React, { useState } from 'react'

const Blog = ({ blog, update }) => {
  const [showDetails, setShowDetails] = useState(false)

  const hideWhenDetails = { display: showDetails ? 'none' : '' }
  const showWhenDetails = { display: showDetails ? '' : 'none' }

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const toggleButton = (buttonLabel) => (    
    <button onClick={toggleShowDetails}>
      {buttonLabel}
    </button>
  )

  const clickableTitle = (title) => (
    <span onClick={toggleShowDetails}>
      {title}
    </span>
  )

  const likeButton = () => (
    <button onClick={handleLike}>like</button>
  )

  const handleLike = (event) => {
    console.log('Like: ', blog)
    blog.likes = blog.likes ? blog.likes + 1 : 1
    update(blog)
  }

  return(
  <div>
    <div style={hideWhenDetails} className='blog'>
      <p>{clickableTitle(blog.title)} {blog.author} {toggleButton('view')}</p>
    </div>
    <div style={showWhenDetails} className='blog'>
      <p>{clickableTitle(blog.title)} {blog.author} {toggleButton('hide')}</p>
      <p>{blog.url}</p>
      <p>likes {blog.likes ? blog.likes : 0} {likeButton()}</p>
    </div>
  </div>
  )
}

export default Blog
