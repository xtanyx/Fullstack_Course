const createBlog = async (page, blog) => {
  await page.getByRole('button', {name: 'create new blog'}).click()
  await page.getByLabel('title').fill(blog.title)
  await page.getByLabel('author').fill(blog.author)
  await page.getByLabel('url').fill(blog.url)
  await page.getByRole('button', {name: 'create'}).click()
  await page.locator('.blogHidden').getByText(`${blog.title} ${blog.author}`).waitFor()
}

const loginWith = async(page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', {name: 'login'}).click()
}

const likeBlog = async (page, title, author, times) => {
  
  await page.locator('.blogHidden').getByText(`${title} ${author}`).getByRole('button',{name:'view'}).click()
  const locator = page.locator('.blogVisible').getByText(`${title} ${author}`)
  for (let i = 0; i < times; i++) {
    await locator.getByRole('button',{name: 'like'}).click()
    console.log(`${title} like ${i+1}`)
    await locator.getByText(`likes ${i+1}`).waitFor()
  }

  await locator.getByRole('button', {name: 'hide'}).click()
}

export {createBlog, loginWith, likeBlog}