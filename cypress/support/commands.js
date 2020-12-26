import Config from '../../src/config'

Cypress.Commands.add('createBlog', (blog) => {
  console.log('BLOG: ', blog)
  console.log('storage key', Config.STORAGE_KEY)
  console.log('localstorage', localStorage.getItem(Config.STORAGE_KEY))
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: blog,
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem(Config.STORAGE_KEY)).token}`
    }
  })
  cy.visit('http://localhost:3000')
})