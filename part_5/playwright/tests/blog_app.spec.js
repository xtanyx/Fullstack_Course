const { test, expect, beforeEach, describe } = require('@playwright/test')
const {createBlog, loginWith, likeBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'root',
        name: 'SuperUser',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async({page}) => {
      loginWith(page, 'root', 'salainen')
      await expect(page.getByText('SuperUser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async({page}) => {
      loginWith(page, 'root', 'wrong_password')
      await expect(page.locator('.notification')).toHaveText('Invalid username/password')
    })
  })

  describe('when logged in', () => {
    beforeEach(async({page}) => {
      loginWith(page, 'root', 'salainen')
    })

    test('a new blog can be created', async({page}) => {
      const blog1 = {
        title: 'Blog 1',
        author: 'Author1',
        url: 'URL 1'
      }

      const blog2 = {
        title: 'Blog 2',
        author: 'Author 2',
        url: 'URL 2'
      }
      await expect(page.getByRole('button', {name: 'create new blog'})).toBeVisible()

      await createBlog(page, blog1)
      await createBlog(page, blog2)

      await expect(page.getByTestId('displayBlog').filter({hasText: `${blog1.title} ${blog1.author}`})).toBeVisible()
      await expect(page.getByTestId('displayBlog').filter({hasText: `${blog2.title} ${blog2.author}`})).toBeVisible()  
    })

    test('a blog can be liked', async({page}) => {
      const blog = {
        title: 'Blog 1',
        author: 'Author1',
        url: 'URL 1'
      }
      await createBlog(page, blog)

      await page.locator('.blogHidden').getByText(`${blog.title} ${blog.author}`).getByRole('button', {name: 'view'}).click()
      await expect(page.locator('.blogVisible').getByText(`${blog.title} ${blog.author}`).getByRole('button', {name: 'like'})).toBeVisible()
      await expect(page.locator('.blogVisible').getByText(`${blog.title} ${blog.author}`).getByText('likes 0')).toBeVisible()

      await page.locator('.blogVisible').getByText(`${blog.title} ${blog.author}`).getByRole('button', {name: 'like'}).click()
      await expect(page.locator('.blogVisible').getByText(`${blog.title} ${blog.author}`).getByText('likes 1')).toBeVisible()
    })
  })

  describe('when deleting a blog', () => {
    beforeEach(async ({page, request}) => {
      await request.post('/api/users', {
        data: {
          username: 'test',
          user: 'tester',
          password: 'salainen'
        }
      })

      await page.goto('/')
      await loginWith(page, 'root', 'salainen')
    })

    test('the logged in user can delete blogs they have created', async({page}) => {
      const blog = {
        title: 'Blog 1',
        author: 'Author1',
        url: 'URL 1'
      }

      const user = {
        username: 'root',
        name: 'SuperUser'
      }
      await createBlog(page, blog)

      await expect(page.getByText(`${user.name} logged in`)).toBeVisible()
      const locator = await page.locator('.blogHidden').getByText(`${blog.title} ${blog.author}`)
      await locator.getByRole('button', {name: 'view'}).click()

      const locator_new = await page.locator('.blogVisible').getByText(`${blog.title} ${blog.author}`)
      await expect(locator_new.getByText(`${user.name}`)).toBeVisible()
      await expect(locator_new.getByRole('button',{name: 'remove'})).toBeVisible()

      page.on('dialog', dialog => dialog.accept())
      await locator_new.getByRole('button',{name: 'remove'}).click()
      await expect(locator_new).not.toBeVisible()
    })

    test('a user cannot delete blogs that they have not created', async({page}) => {
      const blog = {
        title: 'Blog 1',
        author: 'Author1',
        url: 'URL 1'
      }

      const loggedInUser = {
        username: 'root',
        name: 'SuperUser'
      }

      const newUser = {
        username: 'test',
        name: 'tester'
      }

      await createBlog(page, blog)

      const locator_when_hidden = await page.locator('.blogHidden').getByText(`${blog.title} ${blog.author}`)
      const locator_when_visible = await page.locator('.blogVisible').getByText(`${blog.title} ${blog.author}`)

      await expect(page.getByText(`${loggedInUser.name} logged in`)).toBeVisible()
      await locator_when_hidden.getByRole('button', {name: 'view'}).click()

      await expect(locator_when_visible.getByText(`${loggedInUser.name}`)).toBeVisible()
      await expect(locator_when_visible.getByRole('button',{name: 'remove'})).toBeVisible()

      await page.getByRole('button', {name: 'logout'}).click()
      await loginWith(page, 'test', 'salainen')

      await expect(locator_when_hidden).toBeVisible()
      await locator_when_hidden.getByRole('button', {name: 'view'}).click()

      await expect(locator_when_visible).toBeVisible()
      await expect(locator_when_visible.getByText(`${newUser.name}`)).not.toBeVisible()
      await expect(locator_when_visible.getByRole('button',{name: 'remove'})).not.toBeVisible()
    })

  })

  describe('blog order', () => {
    beforeEach(async({page}) => {
      await loginWith(page,'root','salainen') 
      
      await createBlog(page,{title: 'blog1', author: 'author1', url: 'url1'})
      await createBlog(page,{title: 'blog2', author: 'author2', url: 'url2'})
      await createBlog(page,{title: 'blog3', author: 'author3', url: 'url3'})
      await createBlog(page,{title: 'blog4', author: 'author4', url: 'url4'})
      await createBlog(page,{title: 'blog5', author: 'author5', url: 'url5'})

      await likeBlog(page, 'blog1', 'author1', 5)
      await likeBlog(page, 'blog2', 'author2', 3)
      await likeBlog(page, 'blog3', 'author3', 7)
      await likeBlog(page, 'blog5', 'author5', 6)
    })

    test('is descending when displayed', async({page}) => {
      const elements = await page.locator('.blogVisible').all()

      let isdescending = true
      for (let i = 0; i < elements.length - 1; i++) {
        const text1 = await elements[i].getByText('likes').allTextContents()
        const text2 = await elements[i+1].getByText('likes').allTextContents()
        const num1 = Number(text1[0].match(/\d+/)[0])
        const num2 = Number(text2[0].match(/\d+/)[0])
        if (num1 < num2){
          console.log('ERROR')
          isdescending = false
          break
        }
        console.log(`${num1} > ${num2}`)
      }

      expect(isdescending).toEqual(true)
    })
  })
})