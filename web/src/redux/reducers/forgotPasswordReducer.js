const initialState = {
  requesting: false,
  successful: false,
  error: false,
};

const forgotPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FORGOTPASSWORD_REQUESTING':
      return {
        requesting: true,
        successful: false,
        errors: false,
      };
    case 'FORGOTPASSWORD_SUCCESS':
      return {
        error: false,
        requesting: false,
        successful: true,
      };
    case 'FORGOTPASSWORD_ERROR':
      return {
        error: true,
        requesting: false,
        successful: false,
      };
    case 'FORGOTPASSWORD_RESET':
      return initialState;
    default:
      return state;
  }
};

export default forgotPasswordReducer;
