describe('Blog app', function() {
  const testUser1 = {
    username: 'testuser1',
    name: 'User Name1',
    password: 'password1'
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users', testUser1)
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
})