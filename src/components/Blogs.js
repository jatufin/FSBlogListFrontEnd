import React from 'react'

import Blog from './Blog'

const Blogs = ({ blogs, updateBlog }) => {
  const blogSorter = (blogList) => {
    const listToSort = [...blogList]
    
    return listToSort.sort((a,b) => {
      return b.likes - a.likes
    })
  }

  return (
    <div>
      {blogSorter(blogs).map(blog =>
        <Blog key={blog.id} blog={blog} update={updateBlog} />
      )}
    </div>
  )
}

export default Blogs