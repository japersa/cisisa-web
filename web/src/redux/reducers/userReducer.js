const initialState = {
  requestingFetchUsers: false,
  successfulFetchUsers: false,
  errorFetchUsers: false,
  users: {},
  requestingCreateUser: false,
  successfulCreateUser: false,
  errorsCreateUser: false,
  user: null,
  requestingReadUser: false,
  successfulReadUser: false,
  errorsReadUser: false,
  rowEdited: null,
  requestingDeleteUser: false,
  successfulDeleteUser: false,
  errorsDeleteUser: false,
  rowDeleted: null,
  requestingUpdateUser: false,
  successfulUpdateUser: false,
  errorsUpdateUser: false,
  rowUpdated: null,
  requestingFetchCouriers: false,
  successfulFetchCouriers: false,
  errorFetchCouriers: false,
  couriers: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_USERS_REQUESTING":
      return {
        ...state,
        requestingFetchUsers: true,
        successfulFetchUsers: false,
        errorsFetchUsers: false,
      };
    case "FETCH_USER_SUCCESS":
      return {
        ...state,
        errorFetchUsers: false,
        requestingFetchUsers: false,
        successfulFetchUsers: true,
        users: action.value,
      };
    case "FETCH_USER_ERROR":
      return {
        ...state,
        errorFetchUsers: true,
        requestingFetchUsers: false,
        successfulFetchUsers: false,
      };
    case "CREATE_USER_REQUESTING":
      return {
        ...state,
        requestingCreateUser: true,
        successfulCreateUser: false,
        errorsCreateUser: false,
      };
    case "CREATE_USER_SUCCESS":
      return {
        ...state,
        errorsCreateUser: false,
        requestingCreateUser: false,
        successfulCreateUser: true,
        user: action.value,
      };
    case "CREATE_USER_ERROR":
      return {
        ...state,
        errorsCreateUser: true,
        requestingCreateUser: false,
        successfulCreateUser: false,
      };
    case "READ_USER_REQUESTING":
      return {
        ...state,
        requestingReadUser: true,
        successfulReadUser: false,
        errorsReadUser: false,
      };
    case "READ_USER_SUCCESS":
      return {
        ...state,
        errorsReadUser: false,
        requestingReadUser: false,
        successfulReadUser: true,
        rowEdited: action.value,
      };
    case "READ_USER_ERROR":
      return {
        ...state,
        errorsReadUser: true,
        requestingReadUser: false,
        successfulReadUser: false,
      };
    case "DELETE_USER_REQUESTING":
      return {
        ...state,
        requestingDeleteUser: true,
        successfulDeleteUser: false,
        errorsDeleteUser: false,
      };
    case "DELETE_USER_SUCCESS":
      return {
        ...state,
        errorsDeleteUser: false,
        requestingDeleteUser: false,
        successfulDeleteUser: true,
        rowDeleted: action.value,
      };
    case "DELETE_USER_ERROR":
      return {
        ...state,
        errorsDeleteUser: true,
        requestingDeleteUser: false,
        successfulDeleteUser: false,
      };
    case "UPDATE_USER_REQUESTING":
      return {
        ...state,
        requestingUpdateUser: true,
        successfulUpdateUser: false,
        errorsUpdateUser: false,
      };
    case "UPDATE_USER_SUCCESS":
      return {
        ...state,
        errorsUpdateUser: false,
        requestingUpdateUser: false,
        successfulUpdateUser: true,
        rowUpdated: action.value,
      };
    case "UPDATE_USER_ERROR":
      return {
        ...state,
        errorsUpdateUser: true,
        requestingUpdateUser: false,
        successfulUpdateUser: false,
      };
    case "RESET_USER_FORM":
      return {
        ...state,
        requestingCreateUser: false,
        successfulCreateUser: false,
        errorsCreateUser: false,
        user: null,
        requestingReadUser: false,
        successfulReadUser: false,
        errorsReadUser: false,
        rowEdited: null,
        requestingDeleteUser: false,
        successfulDeleteUser: false,
        errorsDeleteUser: false,
        rowDeleted: null,
        requestingUpdateUser: false,
        successfulUpdateUser: false,
        errorsUpdateUser: false,
        rowUpdated: null,
        requestingFetchCouriers: false,
        successfulFetchCouriers: false,
        errorFetchCouriers: false,
        couriers: {},
      };
    case "FETCH_COURIERS_REQUESTING":
      return {
        ...state,
        requestingFetchCouriers: true,
        successfulFetchCouriers: false,
        errorsFetchCouriers: false,
      };
    case "FETCH_COURIER_SUCCESS":
      return {
        ...state,
        errorFetchCouriers: false,
        requestingFetchCouriers: false,
        successfulFetchCouriers: true,
        couriers: action.value,
      };
    case "FETCH_COURIER_ERROR":
      return {
        ...state,
        errorFetchCouriers: true,
        requestingFetchCouriers: false,
        successfulFetchCouriers: false,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
