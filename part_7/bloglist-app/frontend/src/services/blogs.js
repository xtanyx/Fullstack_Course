import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, blog, config);
  return response.data;
};

const like = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog);
  return response.data;
};

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  console.log("removing...");
  await axios.delete(`${baseUrl}/${blog.id}`, config);
};

const comment = async (payload) => {
  const response = await axios.post(`${baseUrl}/${payload.blogId}/comments`, payload)
  return response.data
}

export default { getAll, setToken, create, like, remove, comment };
