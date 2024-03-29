import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, update, remove, currentUser }) => {
  const VIEW_BUTTON_TEXT = 'view'
  const HIDE_BUTTON_TEXT = 'hide'
  const LIKE_BUTTON_TEXT = 'like'

  const [showDetails, setShowDetails] = useState(false)

  const hideWhenDetails = { display: showDetails ? 'none' : '' }
  const showWhenDetails = { display: showDetails ? '' : 'none' }

  const showIfOwner = {
    display: (currentUser.username === blog.user.username )
      ? ''
      : 'none'
  }


  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const toggleButton = (buttonLabel) => (
    <button id='toggle-blog-view' onClick={toggleShowDetails}>
      {buttonLabel}
    </button>
  )

  const clickableTitle = (title) => (
    <span onClick={toggleShowDetails}>
      {title}
    </span>
  )

  const likeButton = () => (
    <button onClick={handleLike}>{LIKE_BUTTON_TEXT}</button>
  )

  const handleLike = () => {
    blog.likes = blog.likes ? blog.likes + 1 : 1
    update(blog)
  }

  const deleteButton = () => (
    <button
      onClick={handleDelete}
      style={showIfOwner}
    >
      remove
    </button>
  )

  const handleDelete = () => {
    remove(blog)
  }

  return(
    <div>
      <div style={hideWhenDetails} className='blog blogheader'>
        <p>{clickableTitle(blog.title)} {blog.author} {toggleButton(VIEW_BUTTON_TEXT)}</p>
      </div>
      <div style={showWhenDetails} className='blog blogdetails'>
        <p>{clickableTitle(blog.title)} {blog.author} {toggleButton(HIDE_BUTTON_TEXT)}</p>
        <p>{blog.url}</p>
        <p>likes {blog.likes ? blog.likes : 0} {likeButton()}</p>
        <p>{blog.user.name}</p>
        <p>{deleteButton()}</p>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
}

export default Blog
