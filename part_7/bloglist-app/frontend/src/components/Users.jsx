import { Link, Route, Routes } from "react-router-dom"
import Styles from '../componentStyles'

const Users = ({users, user, handleLogout}) => {

  return(
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => 
          <tr key={user.id}>
            <td>
              <Styles.StyledLink to={`${user.id}`}>{user.name}</Styles.StyledLink>
            </td>
            <td>{user.blogs.length}</td>
          </tr>)}
        </tbody>
      </table>
    </div>  
  )
}

export default Users