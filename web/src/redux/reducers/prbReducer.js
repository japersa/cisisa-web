const initialState = {
  requestingFetchPrbs: false,
  successfulFetchPrbs: false,
  errorFetchPrbs: false,
  pbrs: [],
};

const prbReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PRBS_REQUESTING":
      return {
        ...state,
        requestingFetchPrbs: true,
        successfulFetchPrbs: false,
        errorsFetchPrbs: false,
      };
    case "FETCH_PRBS_SUCCESS":
      return {
        ...state,
        errorFetchPrbs: false,
        requestingFetchPrbs: false,
        successfulFetchPrbs: true,
        pbrs: action.value,
      };
    case "FETCH_PRBS_ERROR":
      return {
        ...state,
        errorFetchPrbs: true,
        requestingFetchPrbs: false,
        successfulFetchPrbs: false,
      };
    case "RESET_PRBS":
      return initialState;
    default:
      return state;
  }
};

export default prbReducer;
