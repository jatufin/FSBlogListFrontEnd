describe('Blog app', function() {
  const testUser1 = {
    username: 'testuser1',
    name: 'User Name1',
    password: 'password1'
  }

  const testUser2 = {
    username: 'testuser2',
    name: 'User Name2',
    password: 'password2'
  }

  const testBlog1 = {
    title: 'Test Title1',
    author: 'Test Author1',
    url: 'http://Test.Url1'
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users', testUser1)
    cy.request('POST', 'http://localhost:3001/api/users', testUser2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type(testUser1.username)
      cy.get('#password').type(testUser1.password)
      cy.get('#login-button').click()

      cy.contains(`${testUser1.name} logged in`)
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type(testUser1.username)
      cy.get('#password').type(`${testUser1.password}FOO`)
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.contains(`${testUser1.name} logged in`).should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type(testUser1.username)
      cy.get('#password').type(testUser1.password)
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()

      cy.get('#title').type(testBlog1.title)
      cy.get('#author').type(testBlog1.author)
      cy.get('#url').type(testBlog1.url)
      cy.get('#blog-submit').click()

      cy.get('.notification')
        .should('contain', `a new blog ${testBlog1.title} by ${testBlog1.author} added`)

      cy.contains(`${testBlog1.title} ${testBlog1.author}`)
    })

    it('A blog can be liked', function() {
      cy.contains('create new blog').click()

      cy.get('#title').type(testBlog1.title)
      cy.get('#author').type(testBlog1.author)
      cy.get('#url').type(testBlog1.url)
      cy.get('#blog-submit').click()

      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('A blog can be removed', function() {
      cy.contains('create new blog').click()

      cy.get('#title').type(testBlog1.title)
      cy.get('#author').type(testBlog1.author)
      cy.get('#url').type(testBlog1.url)
      cy.get('#blog-submit').click()

      cy.contains('view').click()
      cy.contains('remove').click()
      cy.on('window:confirm', () => true)

      cy.get('.notification').contains('blog removed')
      cy.contains(`${testBlog1.title} ${testBlog1.author}`).should('not.exist')
    })

    it('A blog from another user can not be removed', function() {
      cy.contains('create new blog').click()

      cy.get('#title').type(testBlog1.title)
      cy.get('#author').type(testBlog1.author)
      cy.get('#url').type(testBlog1.url)
      cy.get('#blog-submit').click()

      cy.get('#logout-button').click()
      cy.get('#username').type(testUser2.username)
      cy.get('#password').type(testUser2.password)
      cy.get('#login-button').click()

      cy.contains('view').click()
      cy.contains(`${testBlog1.title} ${testBlog1.author}`)
      cy.contains('remove').should('not.be.visible')
    })
  })
})