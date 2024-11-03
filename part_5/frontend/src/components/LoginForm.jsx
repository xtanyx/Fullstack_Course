import PropTypes from 'prop-types'
import Notification from './Notification'

const LoginForm = ({ message, handleLogin, username, setUsername, password, setPassword }) => {
  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={message}/>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)}></input>
          </label>
        </div>
        <div>
          <label>
            password
            <input type="text" value={password} onChange={({ target }) => setPassword(target.value)}></input>
          </label>
        </div>
        <button type="sumbit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired
}

export default LoginForm