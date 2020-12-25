import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

let component

const mockSubmit = jest.fn()

const testTitle='Test Title'
const testAuthor='Test Author'
const testUrl='http://test.url/'

describe('<BlogForm />', () => {
  beforeEach(() => {
    component = render(
      <BlogForm addBlog={mockSubmit} />
    )
  })

  test('submit handler is called with proper info', () => {
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    fireEvent.change(title, { target: { value: testTitle } })
    fireEvent.change(author, { target: { value: testAuthor } })
    fireEvent.change(url, { target: { value: testUrl } })

    const form = component.container.querySelector('form')
    fireEvent.submit(form)

    expect(mockSubmit.mock.calls).toHaveLength(1)
    expect(mockSubmit.mock.calls[0][0]).toBeDefined()

    const submittedObject = mockSubmit.mock.calls[0][0]
    expect(submittedObject.title).toBe(testTitle)
    expect(submittedObject.author).toBe(testAuthor)
    expect(submittedObject.url).toBe(testUrl)
  })
})