import { createContext, useReducer} from "react";

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return action.payload
    }
    case 'LOGOUT': {
      return null
    }
  }
};

const LoginContext = createContext()

export const LoginContextProvider = (props) => {
  const [user, userDispatch] = useReducer(loginReducer, null)

  return (
    <LoginContext.Provider value={[user, userDispatch]}>
      {props.children}
    </LoginContext.Provider>
  )
}

export default LoginContext
