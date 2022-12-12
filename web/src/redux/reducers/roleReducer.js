const initialState = {
  requestingFetchRoles: false,
  successfulFetchRoles: false,
  errorFetchRoles: false,
  roles: {},
  requestingCreateRole: false,
  successfulCreateRole: false,
  errorsCreateRole: false,
  role: null,
  requestingReadRole: false,
  successfulReadRole: false,
  errorsReadRole: false,
  rowEdited: null,
  requestingDeleteRole: false,
  successfulDeleteRole: false,
  errorsDeleteRole: false,
  rowDeleted: null,
  requestingUpdateRole: false,
  successfulUpdateRole: false,
  errorsUpdateRole: false,
  rowUpdated: null,
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ROLES_REQUESTING":
      return {
        ...state,
        requestingFetchRoles: true,
        successfulFetchRoles: false,
        errorsFetchRoles: false,
      };
    case "FETCH_ROLE_SUCCESS":
      return {
        ...state,
        errorFetchRoles: false,
        requestingFetchRoles: false,
        successfulFetchRoles: true,
        roles: action.value,
      };
    case "FETCH_ROLE_ERROR":
      return {
        ...state,
        errorFetchRoles: true,
        requestingFetchRoles: false,
        successfulFetchRoles: false,
      };
    case "CREATE_ROLE_REQUESTING":
      return {
        ...state,
        requestingCreateRole: true,
        successfulCreateRole: false,
        errorsCreateRole: false,
      };
    case "CREATE_ROLE_SUCCESS":
      return {
        ...state,
        errorsCreateRole: false,
        requestingCreateRole: false,
        successfulCreateRole: true,
        role: action.value,
      };
    case "CREATE_ROLE_ERROR":
      return {
        ...state,
        errorsCreateRole: true,
        requestingCreateRole: false,
        successfulCreateRole: false,
      };
    case "READ_ROLE_REQUESTING":
      return {
        ...state,
        requestingReadRole: true,
        successfulReadRole: false,
        errorsReadRole: false,
      };
    case "READ_ROLE_SUCCESS":
      return {
        ...state,
        errorsReadRole: false,
        requestingReadRole: false,
        successfulReadRole: true,
        rowEdited: action.value,
      };
    case "READ_ROLE_ERROR":
      return {
        ...state,
        errorsReadRole: true,
        requestingReadRole: false,
        successfulReadRole: false,
      };
    case "DELETE_ROLE_REQUESTING":
      return {
        ...state,
        requestingDeleteRole: true,
        successfulDeleteRole: false,
        errorsDeleteRole: false,
      };
    case "DELETE_ROLE_SUCCESS":
      return {
        ...state,
        errorsDeleteRole: false,
        requestingDeleteRole: false,
        successfulDeleteRole: true,
        rowDeleted: action.value,
      };
    case "DELETE_ROLE_ERROR":
      return {
        ...state,
        errorsDeleteRole: true,
        requestingDeleteRole: false,
        successfulDeleteRole: false,
      };
    case "UPDATE_ROLE_REQUESTING":
      return {
        ...state,
        requestingUpdateRole: true,
        successfulUpdateRole: false,
        errorsUpdateRole: false,
      };
    case "UPDATE_ROLE_SUCCESS":
      return {
        ...state,
        errorsUpdateRole: false,
        requestingUpdateRole: false,
        successfulUpdateRole: true,
        rowUpdated: action.value,
      };
    case "UPDATE_ROLE_ERROR":
      return {
        ...state,
        errorsUpdateRole: true,
        requestingUpdateRole: false,
        successfulUpdateRole: false,
      };
    case "RESET_ROLE_FORM":
      return {
        ...state,
        requestingCreateRole: false,
        successfulCreateRole: false,
        errorsCreateRole: false,
        role: null,
        requestingReadRole: false,
        successfulReadRole: false,
        errorsReadRole: false,
        rowEdited: null,
        requestingDeleteRole: false,
        successfulDeleteRole: false,
        errorsDeleteRole: false,
        rowDeleted: null,
        requestingUpdateRole: false,
        successfulUpdateRole: false,
        errorsUpdateRole: false,
        rowUpdated: null,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default roleReducer;
