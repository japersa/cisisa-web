const initialState = {
  requesting: false,
  successful: false,
  error: false,
};

const resetPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESETPASSWORD_REQUESTING':
      return {
        requesting: true,
        successful: false,
        errors: false,
      };
    case 'RESETPASSWORD_SUCCESS':
      return {
        error: false,
        requesting: false,
        successful: true,
      };
    case 'RESETPASSWORD_ERROR':
      return {
        error: true,
        requesting: false,
        successful: false,
      };
    case 'RESETPASSWORD_RESET':
      return initialState;
    default:
      return state;
  }
};

export default resetPasswordReducer;
