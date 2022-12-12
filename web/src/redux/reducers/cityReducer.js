const initialState = {
  requestingFetchCities: false,
  successfulFetchCities: false,
  errorFetchCities: false,
  cities: {},
  requestingCreateCity: false,
  successfulCreateCity: false,
  errorsCreateCity: false,
  city: null,
  requestingReadCity: false,
  successfulReadCity: false,
  errorsReadCity: false,
  rowEdited: null,
  requestingDeleteCity: false,
  successfulDeleteCity: false,
  errorsDeleteCity: false,
  rowDeleted: null,
  requestingUpdateCity: false,
  successfulUpdateCity: false,
  errorsUpdateCity: false,
  rowUpdated: null,
  citiesByDepartment: [],
  requestingReadCitiesByDepartment: false,
  successfulReadCitiesByDepartment: false,
  errorsReadCitiesByDepartment: false,
};

const cityReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CITIES_REQUESTING":
      return {
        ...state,
        requestingFetchCities: true,
        successfulFetchCities: false,
        errorsFetchCities: false,
      };
    case "FETCH_CITY_SUCCESS":
      return {
        ...state,
        errorFetchCities: false,
        requestingFetchCities: false,
        successfulFetchCities: true,
        cities: action.value,
      };
    case "FETCH_CITY_ERROR":
      return {
        ...state,
        errorFetchCities: true,
        requestingFetchCities: false,
        successfulFetchCities: false,
      };
    case "CREATE_CITY_REQUESTING":
      return {
        ...state,
        requestingCreateCity: true,
        successfulCreateCity: false,
        errorsCreateCity: false,
      };
    case "CREATE_CITY_SUCCESS":
      return {
        ...state,
        errorsCreateCity: false,
        requestingCreateCity: false,
        successfulCreateCity: true,
        city: action.value,
      };
    case "CREATE_CITY_ERROR":
      return {
        ...state,
        errorsCreateCity: true,
        requestingCreateCity: false,
        successfulCreateCity: false,
      };
    case "READ_CITY_REQUESTING":
      return {
        ...state,
        requestingReadCity: true,
        successfulReadCity: false,
        errorsReadCity: false,
      };
    case "READ_CITY_SUCCESS":
      return {
        ...state,
        errorsReadCity: false,
        requestingReadCity: false,
        successfulReadCity: true,
        rowEdited: action.value,
      };
    case "READ_CITY_ERROR":
      return {
        ...state,
        errorsReadCity: true,
        requestingReadCity: false,
        successfulReadCity: false,
      };
    case "DELETE_CITY_REQUESTING":
      return {
        ...state,
        requestingDeleteCity: true,
        successfulDeleteCity: false,
        errorsDeleteCity: false,
      };
    case "DELETE_CITY_SUCCESS":
      return {
        ...state,
        errorsDeleteCity: false,
        requestingDeleteCity: false,
        successfulDeleteCity: true,
        rowDeleted: action.value,
      };
    case "DELETE_CITY_ERROR":
      return {
        ...state,
        errorsDeleteCity: true,
        requestingDeleteCity: false,
        successfulDeleteCity: false,
      };
    case "UPDATE_CITY_REQUESTING":
      return {
        ...state,
        requestingUpdateCity: true,
        successfulUpdateCity: false,
        errorsUpdateCity: false,
      };
    case "UPDATE_CITY_SUCCESS":
      return {
        ...state,
        errorsUpdateCity: false,
        requestingUpdateCity: false,
        successfulUpdateCity: true,
        rowUpdated: action.value,
      };
    case "UPDATE_CITY_ERROR":
      return {
        ...state,
        errorsUpdateCity: true,
        requestingUpdateCity: false,
        successfulUpdateCity: false,
      };
    case "RESET_CITY_FORM":
      return {
        ...state,
        requestingCreateCity: false,
        successfulCreateCity: false,
        errorsCreateCity: false,
        city: null,
        requestingReadCity: false,
        successfulReadCity: false,
        errorsReadCity: false,
        rowEdited: null,
        requestingDeleteCity: false,
        successfulDeleteCity: false,
        errorsDeleteCity: false,
        rowDeleted: null,
        requestingUpdateCity: false,
        successfulUpdateCity: false,
        errorsUpdateCity: false,
        rowUpdated: null,
        citiesByDepartment: [],
        requestingReadCitiesByDepartment: false,
        successfulReadCitiesByDepartment: false,
        errorsReadCitiesByDepartment: false,
      };
    case "READBYDEPARTMENT_CITY_REQUESTING":
      return {
        ...state,
        requestingReadCitiesByDepartment: true,
        successfulReadCitiesByDepartment: false,
        errorsReadCitiesByDepartment: false,
      };
    case "READBYDEPARTMENT_CITY_SUCCESS":
      return {
        ...state,
        errorsReadCitiesByDepartment: false,
        requestingReadCitiesByDepartment: false,
        successfulReadCitiesByDepartment: true,
        citiesByDepartment: action.value,
      };
    case "READBYDEPARTMENT_CITY_ERROR":
      return {
        ...state,
        errorsReadNCitiesByDepartment: true,
        requestingReadCitiesByDepartment: false,
        successfulReadCitiesByDepartment: false,
      };
    case "RESET_BYDEPARTMENT_CITY":
      return {
        ...state,
        errorsReadCitiesByDepartment: false,
        requestingReadCitiesByDepartment: false,
        successfulReadCitiesByDepartment: false,
        citiesByDepartment: [],
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default cityReducer;
