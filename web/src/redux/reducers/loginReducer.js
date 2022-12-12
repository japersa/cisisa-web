const initialState = {
  requesting: false,
  successful: false,
  error: false,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUESTING':
      return {
        requesting: true,
        successful: false,
        errors: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        error: false,
        requesting: false,
        successful: true,
      };
    case 'LOGIN_ERROR':
      return {
        error: true,
        requesting: false,
        successful: false,
      };
    case 'LOGIN_RESET':
      return initialState;
    default:
      return state;
  }
};

export default loginReducer;
