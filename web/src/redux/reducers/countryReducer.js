const initialState = {
  requestingFetchCountries: false,
  successfulFetchCountries: false,
  errorFetchCountries: false,
  countries: {},
  requestingCreateCountry: false,
  successfulCreateCountry: false,
  errorsCreateCountry: false,
  country: null,
  requestingReadCountry: false,
  successfulReadCountry: false,
  errorsReadCountry: false,
  rowEdited: null,
  requestingDeleteCountry: false,
  successfulDeleteCountry: false,
  errorsDeleteCountry: false,
  rowDeleted: null,
  requestingUpdateCountry: false,
  successfulUpdateCountry: false,
  errorsUpdateCountry: false,
  rowUpdated: null,
};

const countryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_COUNTRIES_REQUESTING":
      return {
        ...state,
        requestingFetchCountries: true,
        successfulFetchCountries: false,
        errorsFetchCountries: false,
      };
    case "FETCH_COUNTRY_SUCCESS":
      return {
        ...state,
        errorFetchCountries: false,
        requestingFetchCountries: false,
        successfulFetchCountries: true,
        countries: action.value,
      };
    case "FETCH_COUNTRY_ERROR":
      return {
        ...state,
        errorFetchCountries: true,
        requestingFetchCountries: false,
        successfulFetchCountries: false,
      };
    case "CREATE_COUNTRY_REQUESTING":
      return {
        ...state,
        requestingCreateCountry: true,
        successfulCreateCountry: false,
        errorsCreateCountry: false,
      };
    case "CREATE_COUNTRY_SUCCESS":
      return {
        ...state,
        errorsCreateCountry: false,
        requestingCreateCountry: false,
        successfulCreateCountry: true,
        country: action.value,
      };
    case "CREATE_COUNTRY_ERROR":
      return {
        ...state,
        errorsCreateCountry: true,
        requestingCreateCountry: false,
        successfulCreateCountry: false,
      };
    case "READ_COUNTRY_REQUESTING":
      return {
        ...state,
        requestingReadCountry: true,
        successfulReadCountry: false,
        errorsReadCountry: false,
      };
    case "READ_COUNTRY_SUCCESS":
      return {
        ...state,
        errorsReadCountry: false,
        requestingReadCountry: false,
        successfulReadCountry: true,
        rowEdited: action.value,
      };
    case "READ_COUNTRY_ERROR":
      return {
        ...state,
        errorsReadCountry: true,
        requestingReadCountry: false,
        successfulReadCountry: false,
      };
    case "DELETE_COUNTRY_REQUESTING":
      return {
        ...state,
        requestingDeleteCountry: true,
        successfulDeleteCountry: false,
        errorsDeleteCountry: false,
      };
    case "DELETE_COUNTRY_SUCCESS":
      return {
        ...state,
        errorsDeleteCountry: false,
        requestingDeleteCountry: false,
        successfulDeleteCountry: true,
        rowDeleted: action.value,
      };
    case "DELETE_COUNTRY_ERROR":
      return {
        ...state,
        errorsDeleteCountry: true,
        requestingDeleteCountry: false,
        successfulDeleteCountry: false,
      };
    case "UPDATE_COUNTRY_REQUESTING":
      return {
        ...state,
        requestingUpdateCountry: true,
        successfulUpdateCountry: false,
        errorsUpdateCountry: false,
      };
    case "UPDATE_COUNTRY_SUCCESS":
      return {
        ...state,
        errorsUpdateCountry: false,
        requestingUpdateCountry: false,
        successfulUpdateCountry: true,
        rowUpdated: action.value,
      };
    case "UPDATE_COUNTRY_ERROR":
      return {
        ...state,
        errorsUpdateCountry: true,
        requestingUpdateCountry: false,
        successfulUpdateCountry: false,
      };
    case "RESET_COUNTRY_FORM":
      return {
        ...state,
        requestingCreateCountry: false,
        successfulCreateCountry: false,
        errorsCreateCountry: false,
        country: null,
        requestingReadCountry: false,
        successfulReadCountry: false,
        errorsReadCountry: false,
        rowEdited: null,
        requestingDeleteCountry: false,
        successfulDeleteCountry: false,
        errorsDeleteCountry: false,
        rowDeleted: null,
        requestingUpdateCountry: false,
        successfulUpdateCountry: false,
        errorsUpdateCountry: false,
        rowUpdated: null,
        requestingUpdateCountry: false,
        successfulUpdateCountry: false,
        errorsUpdateCountry: false,
        rowUpdated: null,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default countryReducer;
