const initialState = {
  requestingFetchPermissions: false,
  successfulFetchPermissions: false,
  errorFetchPermissions: false,
  permissions: {},
  requestingCreatePermission: false,
  successfulCreatePermission: false,
  errorsCreatePermission: false,
  permission: null,
  requestingReadPermission: false,
  successfulReadPermission: false,
  errorsReadPermission: false,
  rowEdited: null,
  requestingDeletePermission: false,
  successfulDeletePermission: false,
  errorsDeletePermission: false,
  rowDeleted: null,
  requestingUpdatePermission: false,
  successfulUpdatePermission: false,
  errorsUpdatePermission: false,
  rowUpdated: null,
};

const permissionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PERMISSIONS_REQUESTING":
      return {
        ...state,
        requestingFetchPermissions: true,
        successfulFetchPermissions: false,
        errorsFetchPermissions: false,
      };
    case "FETCH_PERMISSION_SUCCESS":
      return {
        ...state,
        errorFetchPermissions: false,
        requestingFetchPermissions: false,
        successfulFetchPermissions: true,
        permissions: action.value,
      };
    case "FETCH_PERMISSION_ERROR":
      return {
        ...state,
        errorFetchPermissions: true,
        requestingFetchPermissions: false,
        successfulFetchPermissions: false,
      };
    case "CREATE_PERMISSION_REQUESTING":
      return {
        ...state,
        requestingCreatePermission: true,
        successfulCreatePermission: false,
        errorsCreatePermission: false,
      };
    case "CREATE_PERMISSION_SUCCESS":
      return {
        ...state,
        errorsCreatePermission: false,
        requestingCreatePermission: false,
        successfulCreatePermission: true,
        permission: action.value,
      };
    case "CREATE_PERMISSION_ERROR":
      return {
        ...state,
        errorsCreatePermission: true,
        requestingCreatePermission: false,
        successfulCreatePermission: false,
      };
    case "READ_PERMISSION_REQUESTING":
      return {
        ...state,
        requestingReadPermission: true,
        successfulReadPermission: false,
        errorsReadPermission: false,
      };
    case "READ_PERMISSION_SUCCESS":
      return {
        ...state,
        errorsReadPermission: false,
        requestingReadPermission: false,
        successfulReadPermission: true,
        rowEdited: action.value,
      };
    case "READ_PERMISSION_ERROR":
      return {
        ...state,
        errorsReadPermission: true,
        requestingReadPermission: false,
        successfulReadPermission: false,
      };
    case "DELETE_PERMISSION_REQUESTING":
      return {
        ...state,
        requestingDeletePermission: true,
        successfulDeletePermission: false,
        errorsDeletePermission: false,
      };
    case "DELETE_PERMISSION_SUCCESS":
      return {
        ...state,
        errorsDeletePermission: false,
        requestingDeletePermission: false,
        successfulDeletePermission: true,
        rowDeleted: action.value,
      };
    case "DELETE_PERMISSION_ERROR":
      return {
        ...state,
        errorsDeletePermission: true,
        requestingDeletePermission: false,
        successfulDeletePermission: false,
      };
    case "UPDATE_PERMISSION_REQUESTING":
      return {
        ...state,
        requestingUpdatePermission: true,
        successfulUpdatePermission: false,
        errorsUpdatePermission: false,
      };
    case "UPDATE_PERMISSION_SUCCESS":
      return {
        ...state,
        errorsUpdatePermission: false,
        requestingUpdatePermission: false,
        successfulUpdatePermission: true,
        rowUpdated: action.value,
      };
    case "UPDATE_PERMISSION_ERROR":
      return {
        ...state,
        errorsUpdatePermission: true,
        requestingUpdatePermission: false,
        successfulUpdatePermission: false,
      };
    case "RESET_PERMISSION_FORM":
      return {
        ...state,
        requestingCreatePermission: false,
        successfulCreatePermission: false,
        errorsCreatePermission: false,
        permission: null,
        requestingReadPermission: false,
        successfulReadPermission: false,
        errorsReadPermission: false,
        rowEdited: null,
        requestingDeletePermission: false,
        successfulDeletePermission: false,
        errorsDeletePermission: false,
        rowDeleted: null,
        requestingUpdatePermission: false,
        successfulUpdatePermission: false,
        errorsUpdatePermission: false,
        rowUpdated: null,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default permissionReducer;
