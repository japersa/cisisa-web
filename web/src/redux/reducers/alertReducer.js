const initialState = {
  showAlert: false,
  type: '',
  title: '',
  message: '',
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_ALERT":
      return {
        ...state,
        showAlert: true,
        type: action.value.type,
        title: action.value.title,
        message: action.value.message,
      };
    case "RESET_ALERT":
      return initialState;
    default:
      return state;
  }
};

export default alertReducer;
