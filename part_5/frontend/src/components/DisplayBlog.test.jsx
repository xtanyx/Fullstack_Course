import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DisplayBlog from './DisplayBlog'
import { test } from 'vitest'

test('blog is rendered correctly by default', async () => {
  const blog = {
    title: 'test_blog',
    author: 'test_author',
    url: 'test_url',
    likes: 5,
    user: {
      username: 'root',
      name: 'Test1'
    }
  }

  const user = {
    username: 'notroot',
    name: 'Test2'
  }

  const { container } = render(<DisplayBlog blog={blog} user={user}/>)
  const divVisible = container.querySelector('.blogHidden')
  expect(divVisible).toHaveTextContent(blog.title)
  expect(divVisible).toHaveTextContent(blog.author)

  const divHidden = container.querySelector('.blogVisible')
  expect(divHidden).toHaveStyle('display: none')
})

test('after cliking the show button, url and likes are displayed', async() => {
  const blog = {
    title: 'test_blog',
    author: 'test_author',
    url: 'test_url',
    likes: 5,
    user: {
      username: 'root',
      name: 'Test1'
    }
  }

  const user = {
    username: 'notroot',
    name: 'Test2'
  }

  const { container } = render(<DisplayBlog blog={blog} user={user}/>)

  const divBeforeClick = container.querySelector('.blogVisible')
  expect(divBeforeClick).toHaveStyle('display: none')

  const userSim = userEvent.setup()
  const button = screen.getByText('view')
  await userSim.click(button)

  const divAfterClick = container.querySelector('.blogVisible')
  expect(divAfterClick).not.toHaveStyle('display: none')

  expect(divAfterClick).toHaveTextContent(blog.url)
  expect(divAfterClick).toHaveTextContent(blog.likes)
})

test('clicking the like button twice calls the event handler twice', async() => {
  const blog = {
    title: 'test_blog',
    author: 'test_author',
    url: 'test_url',
    likes: 5,
    user: {
      username: 'root',
      name: 'Test1'
    }
  }

  const user = {
    username: 'notroot',
    name: 'Test2'
  }

  const mockHandler = vi.fn()

  render(<DisplayBlog blog={blog} user={user} likeBlog={mockHandler}/>)

  const userSim = userEvent.setup()
  const button = screen.getByText('like')
  await userSim.click(button)
  await userSim.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})