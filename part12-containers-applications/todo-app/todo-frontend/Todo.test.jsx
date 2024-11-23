import { render, screen, fireEvent } from "@testing-library/react";
import Todo from "./src/Todos/Todo";

describe('Todo', () => {
  it('render a todo', () => {
    const todo = {
      text: 'A new todo',
      done: false
    }

    const onClickDelete = jest.fn()
    const onClickComplete = jest.fn()

    render(<Todo todo={todo} onClickDelete={onClickDelete} onClickComplete={onClickComplete}/>)

    expect(screen.getByText('A new todo')).toBeDefined()
  })
})