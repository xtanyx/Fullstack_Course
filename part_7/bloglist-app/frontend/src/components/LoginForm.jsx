import PropTypes from "prop-types";
import Notification from "./Notification";
import Styles from '../componentStyles'

const LoginForm = ({
  message,
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  return (
    <div>
      <h2>log in to application</h2>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          <Styles.Label>
            username
            <Styles.Input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            ></Styles.Input>
          </Styles.Label>
        </div>
        <div>
          <Styles.Label>
            password
            <Styles.Input
              type="text"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            ></Styles.Input>
          </Styles.Label>
        </div>
        <Styles.Button type="sumbit">login</Styles.Button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
};

export default LoginForm;
