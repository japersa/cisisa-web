const initialState = {
  show: false,
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_LOADING":
      return {
        ...state,
        show: true,
      };
    case "HIDE_LOADING":
      return initialState;
    default:
      return state;
  }
};

export default loadingReducer;
