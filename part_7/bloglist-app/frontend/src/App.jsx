import { useState, useEffect, useContext } from "react";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import Users from './components/Users'
import loginService from "./services/login";
import userService from './services/users'
import NotificationContext from "./components/NotificationContext";
import LoginContext from "./components/LoginContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import User from "./components/User";
import Blog from "./components/Blog";
import Styles from './componentStyles'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, loginDispatch] = useContext(LoginContext)
  const [notification, notificationDispatch] = useContext(NotificationContext);
  const [users, setUsers] = useState([])

  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const compareBlogs = (a, b) => {
    if (a.likes > b.likes) {
      return -1;
    } else if (a.likes < b.likes) {
      return 1;
    }
    return 0;
  };

  const compareUsers = (a, b) => {
    if (a.blogs.length > b.blogs.length) {
      return -1;
    } else if (a.blogs.length < b.blogs.length) {
      return 1;
    }
    return 0;
  };

  useQuery({
    queryKey: ["allUsers"],
    queryFn: () =>
      userService
        .getUsers()
        .then(users => users.sort(compareUsers))
        .then(users => {
          setUsers(users)
          return users
        })
  })

  useQuery({
    queryKey: ["allBlogs"],
    queryFn: () =>
      blogService
        .getAll()
        .then((blogs) => blogs.sort(compareBlogs))
        .then((blogs) => {
          setBlogs(blogs);
          return blogs;
        }),
  });

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"]})
    },
  });

  const likeBlogMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBlogs"]});
      queryClient.invalidateQueries({ queryKey: ["allUsers"]})
    },
    onError: () => {
      notificationDispatch({
        type: "NEW_NOTIFICATION",
        payload: "Blog title/url missing",
      });
      setTimeout(() => {
        notificationDispatch({ type: "REMOVE_NOTIFICATION" });
      }, 3000);
    },
  });

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBlogs"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"]})
    },
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      loginDispatch({type: 'LOGIN', payload: user})
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);

      notificationDispatch({
        type: "NEW_NOTIFICATION",
        payload: "Login Successful",
      });
      setTimeout(() => {
        notificationDispatch({ type: "REMOVE_NOTIFICATION" });
      }, 3000);

      loginDispatch({type: 'LOGIN', payload: user});
      setUsername("");
      setPassword("");
      navigate('/')
    } catch (exception) {
      notificationDispatch({
        type: "NEW_NOTIFICATION",
        payload: "Invalid username/password",
      });
      setTimeout(() => {
        notificationDispatch({ type: "REMOVE_NOTIFICATION" });
      }, 3000);
    }
  };

  const handleLogout = (event) => {
    window.localStorage.removeItem("loggedBlogAppUser");
    loginDispatch({type: 'LOGOUT'});
    notificationDispatch({ type: "NEW_NOTIFICATION", payload: "Logged out!" });
    setTimeout(() => {
      notificationDispatch({ type: "REMOVE_NOTIFICATION" });
    }, 3000);
  };

  const createBlog = async (blog) => {
    if (blog.title === "") {
      blog.title = undefined;
    } else if (blog.url === "") {
      blog.url = undefined;
    }
    console.log(blog);
    await createBlogMutation.mutate(blog, {
      onSuccess: () => {
        notificationDispatch({
          type: "NEW_NOTIFICATION",
          payload: `Blog ${blog.title} by ${blog.author} created!`,
        });
        setTimeout(() => {
          notificationDispatch({ type: "REMOVE_NOTIFICATION" });
        }, 3000);
      },
      onError: () => {
        notificationDispatch({
          type: "NEW_NOTIFICATION",
          payload: "Blog title/url missing",
        });
        setTimeout(() => {
          notificationDispatch({ type: "REMOVE_NOTIFICATION" });
        }, 3000);
      },
    });
  };

  const likeBlog = async (blog) => {
    await likeBlogMutation.mutate(blog, {
      onSuccess: () => {
        notificationDispatch({
          type: "NEW_NOTIFICATION",
          payload: `Blog ${blog.title} by ${blog.author} liked!`,
        });
        setTimeout(() => {
          notificationDispatch({ type: "REMOVE_NOTIFICATION" });
        }, 3000);
      },
      onError: () => {
        notificationDispatch({
          type: "NEW_NOTIFICATION",
          payload: "Unexpected error",
        });
        setTimeout(() => {
          notificationDispatch({ type: "REMOVE_NOTIFICATION" });
        }, 3000);
      },
    });
  };

  const removeBlog = async (blog) => {
    const toRemove = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    );
    if (toRemove) {
      await removeBlogMutation.mutate(blog, {
        onError: () => {
          notificationDispatch({
            type: "NEW_NOTIFICATION",
            payload: "Unexpected error",
          });
          setTimeout(() => {
            notificationDispatch({ type: "REMOVE_NOTIFICATION" });
          }, 3000);
        },
        onSuccess: () =>{
          navigate('/')
        }
      });
    }
  };

  const addComment = async (payload) => {
    const updatedBlog = await blogService.comment(payload)
    console.log(updatedBlog)
    setBlogs(blogs
      .filter(blog => blog.id !== updatedBlog.id)
      .concat(updatedBlog))
  }

  const stylePadding = {
    paddingRight: 5
  }

  return (
    <Styles.Page>
      {user === null ? (
        <LoginForm
          message={notification}
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      ) : (
        <div>
          <Styles.Navigation>
            <Styles.StyledLink style={stylePadding} to='/'>blogs</Styles.StyledLink>
            <Styles.StyledLink style={stylePadding} to='/users'>users</Styles.StyledLink>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </Styles.Navigation>
          <h2>blog app</h2>
          <Routes>
            <Route path='/users/:id' element={<User users={users} handleLogout={handleLogout}/>}/>
            <Route path='/users' element={<Users users={users} user={user} handleLogout={handleLogout}/>}/>
            <Route path='/blogs/:id' element={<Blog
                                               likeBlog={likeBlog} 
                                               handleLogout={handleLogout} 
                                               removeBlog={removeBlog}
                                               blogs={blogs}
                                               user={user}
                                               addComment={addComment}
                                              />}/>
            <Route path='/' element={<BlogForm
                                      message={notification}
                                      blogs={blogs}
                                      user={user}
                                      handleLogout={handleLogout}
                                      createBlog={createBlog}
                                      likeBlog={likeBlog}
                                      removeBlog={removeBlog}
                                    />}/>
          </Routes>
          
        </div>
      )}
    </Styles.Page>
  );
};

export default App;
