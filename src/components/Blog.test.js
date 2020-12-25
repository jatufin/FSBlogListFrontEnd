import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

describe('<Blog />', () => {
  const testBlog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'Test URL',
    likes: 42,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const testUserIsOwner = {
    username: 'testuser'
  }

  const testUserIsNotOwner = {
    username: 'otheruser'
  }

  const mockUpdate = jest.fn()
  const mockRemove = jest.fn()

  let component

  beforeEach(() => {
    component = render(
      <Blog
        blog={testBlog}
        update={mockUpdate}
        remove={mockRemove}
        currentUser={testUserIsOwner}
      />
    )
  })

  test('initially only title and author are shown', () => {
    let divs = component.container.querySelectorAll('.blog')

    expect(divs).toHaveLength(2)

    expect(divs[0]).not.toHaveStyle('display: none')
    expect(divs[0].outerHTML).toMatch(testBlog.title)
    expect(divs[0].outerHTML).toMatch(testBlog.author)
    expect(divs[0].outerHTML).not.toMatch(testBlog.url)
    expect(divs[0].outerHTML).not.toMatch(testBlog.likes.toString())

    expect(divs[1]).toHaveStyle('display: none')
  })
})
