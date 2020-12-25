import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

describe('<Blog />', () => {
  const VIEW_BUTTON_TEXT = 'view'
  // const HIDE_BUTTON_TEXT = 'hide'
  const LIKE_BUTTON_TEXT = 'like'

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

  /*
  const testUserIsNotOwner = {
    username: 'otheruser'
  }
  */

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
    const divs = component.container.querySelectorAll('.blog')

    expect(divs).toHaveLength(2)

    expect(divs[0]).not.toHaveStyle('display: none')
    expect(divs[0].outerHTML).toMatch(testBlog.title)
    expect(divs[0].outerHTML).toMatch(testBlog.author)
    expect(divs[0].outerHTML).not.toMatch(testBlog.url)
    expect(divs[0].outerHTML).not.toMatch(testBlog.likes.toString())

    expect(divs[1]).toHaveStyle('display: none')
  })

  test('url and likes are shown after view button is clicked', () => {
    const button = component.getByText(VIEW_BUTTON_TEXT)
    fireEvent.click(button)

    const divs = component.container.querySelectorAll('.blog')

    expect(divs).toHaveLength(2)

    expect(divs[0]).toHaveStyle('display: none')
    expect(divs[1]).not.toHaveStyle('display: none')
    expect(divs[1].outerHTML).toMatch(testBlog.url)
    expect(divs[1].outerHTML).toMatch(testBlog.likes.toString())
  })

  test('two clicks of like button are handled twice', () => {
    const button = component.getByText(LIKE_BUTTON_TEXT)

    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockUpdate.mock.calls).toHaveLength(2)

  })
})
