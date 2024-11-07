import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBlog from "./CreateBlog";
import { test } from "vitest";

test("form calls event handler with the right details when button create is clicked", async () => {
  const blog = {
    title: "test blog",
    author: "test author",
    url: "test url",
  };

  const mockHandler = vi.fn();
  const mockSetVisible = vi.fn();
  const { container } = render(
    <CreateBlog createBlog={mockHandler} setVisible={mockSetVisible} />,
  );

  const userSim = userEvent.setup();
  const titleInput = container.querySelector("#title");
  const authorInput = container.querySelector("#author");
  const urlInput = container.querySelector("#url");
  const button = screen.getByText("create");

  await userSim.type(titleInput, blog.title);
  await userSim.type(authorInput, blog.author);
  await userSim.type(urlInput, blog.url);
  await userSim.click(button);

  console.log(mockHandler.mock.calls[0][0]);

  expect(mockHandler.mock.calls[0][0].title).toBe(blog.title);
  expect(mockHandler.mock.calls[0][0].author).toBe(blog.author);
  expect(mockHandler.mock.calls[0][0].url).toBe(blog.url);
});
