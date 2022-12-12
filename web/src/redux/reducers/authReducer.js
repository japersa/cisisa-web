const initialState = {
  isAuthenticated: false,
  session: null
}

export const getInitialState = () => JSON.parse(JSON.stringify(initialState));

const authReducer = (
  state = getInitialState(),
  action
) => {
  switch (action.type) {
    case "SIGN_IN":
      return Object.assign({}, state, {
        isAuthenticated: true,
        session: action.payload,
      });
    case "RESTORE_SESION":
      return Object.assign({}, state, {
        isAuthenticated: true,
        session: action.payload,
      });
    case "SIGN_OUT":
      return getInitialState();
    default:
      return state;
  }
}

export default authReducer;
