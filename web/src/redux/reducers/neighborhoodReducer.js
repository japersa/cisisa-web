const initialState = {
  requestingFetchNeighborhoods: false,
  successfulFetchNeighborhoods: false,
  errorFetchNeighborhoods: false,
  neighborhoods: {},
  requestingCreateNeighborhood: false,
  successfulCreateNeighborhood: false,
  errorsCreateNeighborhood: false,
  neighborhood: null,
  requestingReadNeighborhood: false,
  successfulReadNeighborhood: false,
  errorsReadNeighborhood: false,
  rowEdited: null,
  requestingDeleteNeighborhood: false,
  successfulDeleteNeighborhood: false,
  errorsDeleteNeighborhood: false,
  rowDeleted: null,
  requestingUpdateNeighborhood: false,
  successfulUpdateNeighborhood: false,
  errorsUpdateNeighborhood: false,
  rowUpdated: null,
  neighborhoodsByCity: [],
  requestingReadNeighborhoodsByCity: false,
  successfulReadNeighborhoodsByCity: false,
  errorsReadNeighborhoodsByCity: false,
  neighborhoodsByZone: [],
  requestingReadNeighborhoodsByZone: false,
  successfulReadNeighborhoodsByZone: false,
  errorsReadNeighborhoodsByZone: false,
};

const neighborhoodReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_NEIGHBORHOODS_REQUESTING":
      return {
        ...state,
        requestingFetchNeighborhoods: true,
        successfulFetchNeighborhoods: false,
        errorsFetchNeighborhoods: false,
      };
    case "FETCH_NEIGHBORHOOD_SUCCESS":
      return {
        ...state,
        errorFetchNeighborhoods: false,
        requestingFetchNeighborhoods: false,
        successfulFetchNeighborhoods: true,
        neighborhoods: action.value,
      };
    case "FETCH_NEIGHBORHOOD_ERROR":
      return {
        ...state,
        errorFetchNeighborhoods: true,
        requestingFetchNeighborhoods: false,
        successfulFetchNeighborhoods: false,
      };
    case "CREATE_NEIGHBORHOOD_REQUESTING":
      return {
        ...state,
        requestingCreateNeighborhood: true,
        successfulCreateNeighborhood: false,
        errorsCreateNeighborhood: false,
      };
    case "CREATE_NEIGHBORHOOD_SUCCESS":
      return {
        ...state,
        errorsCreateNeighborhood: false,
        requestingCreateNeighborhood: false,
        successfulCreateNeighborhood: true,
        neighborhood: action.value,
      };
    case "CREATE_NEIGHBORHOOD_ERROR":
      return {
        ...state,
        errorsCreateNeighborhood: true,
        requestingCreateNeighborhood: false,
        successfulCreateNeighborhood: false,
      };
    case "READ_NEIGHBORHOOD_REQUESTING":
      return {
        ...state,
        requestingReadNeighborhood: true,
        successfulReadNeighborhood: false,
        errorsReadNeighborhood: false,
      };
    case "READ_NEIGHBORHOOD_SUCCESS":
      return {
        ...state,
        errorsReadNeighborhood: false,
        requestingReadNeighborhood: false,
        successfulReadNeighborhood: true,
        rowEdited: action.value,
      };
    case "READ_NEIGHBORHOOD_ERROR":
      return {
        ...state,
        errorsReadNeighborhood: true,
        requestingReadNeighborhood: false,
        successfulReadNeighborhood: false,
      };
    case "DELETE_NEIGHBORHOOD_REQUESTING":
      return {
        ...state,
        requestingDeleteNeighborhood: true,
        successfulDeleteNeighborhood: false,
        errorsDeleteNeighborhood: false,
      };
    case "DELETE_NEIGHBORHOOD_SUCCESS":
      return {
        ...state,
        errorsDeleteNeighborhood: false,
        requestingDeleteNeighborhood: false,
        successfulDeleteNeighborhood: true,
        rowDeleted: action.value,
      };
    case "DELETE_NEIGHBORHOOD_ERROR":
      return {
        ...state,
        errorsDeleteNeighborhood: true,
        requestingDeleteNeighborhood: false,
        successfulDeleteNeighborhood: false,
      };
    case "UPDATE_NEIGHBORHOOD_REQUESTING":
      return {
        ...state,
        requestingUpdateNeighborhood: true,
        successfulUpdateNeighborhood: false,
        errorsUpdateNeighborhood: false,
      };
    case "UPDATE_NEIGHBORHOOD_SUCCESS":
      return {
        ...state,
        errorsUpdateNeighborhood: false,
        requestingUpdateNeighborhood: false,
        successfulUpdateNeighborhood: true,
        rowUpdated: action.value,
      };
    case "UPDATE_NEIGHBORHOOD_ERROR":
      return {
        ...state,
        errorsUpdateNeighborhood: true,
        requestingUpdateNeighborhood: false,
        successfulUpdateNeighborhood: false,
      };
    case "RESET_NEIGHBORHOOD_FORM":
      return {
        ...state,
        requestingCreateNeighborhood: false,
        successfulCreateNeighborhood: false,
        errorsCreateNeighborhood: false,
        neighborhood: null,
        requestingReadNeighborhood: false,
        successfulReadNeighborhood: false,
        errorsReadNeighborhood: false,
        rowEdited: null,
        requestingDeleteNeighborhood: false,
        successfulDeleteNeighborhood: false,
        rowDeleted: null,
        requestingUpdateNeighborhood: false,
        successfulUpdateNeighborhood: false,
        errorsUpdateNeighborhood: false,
        rowUpdated: null,
        neighborhoodsByCity: [],
        requestingReadNeighborhoodsByCity: false,
        successfulReadNeighborhoodsByCity: false,
        errorsReadNeighborhoodsByCity: false,
        neighborhoodsByZone: [],
        requestingReadNeighborhoodsByZone: false,
        successfulReadNeighborhoodsByZone: false,
        errorsReadNeighborhoodsByZone: false,
      };
    case "READBYCITY_NEIGHBORHOOD_REQUESTING":
      return {
        ...state,
        requestingReadNeighborhoodsByCity: true,
        successfulReadNeighborhoodsByCity: false,
        errorsReadNeighborhoodsByCity: false,
      };
    case "READBYCITY_NEIGHBORHOOD_SUCCESS":
      return {
        ...state,
        errorsReadNeighborhoodsByCity: false,
        requestingReadNeighborhoodsByCity: false,
        successfulReadNeighborhoodsByCity: true,
        neighborhoodsByCity: action.value,
      };
    case "READBYCITY_NEIGHBORHOOD_ERROR":
      return {
        ...state,
        errorsReadNeighborhoodsByCity: true,
        requestingReadNeighborhoodsByCity: false,
        successfulReadNeighborhoodsByCity: false,
      };
    case "RESET_BYCITY_NEIGHBORHOOD":
      return {
        ...state,
        errorsReadNeighborhoodsByCity: false,
        requestingReadNeighborhoodsByCity: false,
        successfulReadNeighborhoodsByCity: false,
        neighborhoodsByCity: [],
      };
    case "READBYZONE_NEIGHBORHOOD_REQUESTING":
      return {
        ...state,
        requestingReadNeighborhoodsByZone: true,
        successfulReadNeighborhoodsByZone: false,
        errorsReadNeighborhoodsByZone: false,
      };
    case "READBYZONE_NEIGHBORHOOD_SUCCESS":
      return {
        ...state,
        errorsReadNeighborhoodsByZone: false,
        requestingReadNeighborhoodsByZone: false,
        successfulReadNeighborhoodsByZone: true,
        neighborhoodsByZone: action.value,
      };
    case "READBYZONE_NEIGHBORHOOD_ERROR":
      return {
        ...state,
        errorsReadNeighborhoodsByZone: true,
        requestingReadNeighborhoodsByZone: false,
        successfulReadNeighborhoodsByZone: false,
      };
    case "RESET_BYZONE_NEIGHBORHOOD":
      return {
        ...state,
        errorsReadNeighborhoodsByZone: false,
        requestingReadNeighborhoodsByZone: false,
        successfulReadNeighborhoodsByZone: false,
        neighborhoodsByZone: [],
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default neighborhoodReducer;
