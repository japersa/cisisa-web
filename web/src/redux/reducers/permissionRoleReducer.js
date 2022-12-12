const initialState = {
  requestingFetchPermissionsRoles: false,
  successfulFetchPermissionsRoles: false,
  errorFetchPermissionsRoles: false,
  permissionsRoles: {},
  requestingCreatePermissionRole: false,
  successfulCreatePermissionRole: false,
  errorsCreatePermissionRole: false,
  permissionRole: null,
  requestingReadPermissionRole: false,
  successfulReadPermissionRole: false,
  errorsReadPermissionRole: false,
  rowEdited: null,
  requestingDeletePermissionRole: false,
  successfulDeletePermissionRole: false,
  errorsDeletePermissionRole: false,
  rowDeleted: null,
  requestingUpdatePermissionRole: false,
  successfulUpdatePermissionRole: false,
  errorsUpdatePermissionRole: false,
  rowUpdated: null,
};

const permissionRoleReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PERMISSIONS_ROLES_REQUESTING":
      return {
        ...state,
        requestingFetchPermissionsRoles: true,
        successfulFetchPermissionsRoles: false,
        errorsFetchPermissionsRoles: false,
      };
    case "FETCH_PERMISSION_ROLE_SUCCESS":
      return {
        ...state,
        errorFetchPermissionsRoles: false,
        requestingFetchPermissionsRoles: false,
        successfulFetchPermissionsRoles: true,
        permissionsRoles: action.value,
      };
    case "FETCH_PERMISSION_ROLE_ERROR":
      return {
        ...state,
        errorFetchPermissionsRoles: true,
        requestingFetchPermissionsRoles: false,
        successfulFetchPermissionsRoles: false,
      };
    case "CREATE_PERMISSION_ROLE_REQUESTING":
      return {
        ...state,
        requestingCreatePermissionRole: true,
        successfulCreatePermissionRole: false,
        errorsCreatePermissionRole: false,
      };
    case "CREATE_PERMISSION_ROLE_SUCCESS":
      return {
        ...state,
        errorsCreatePermissionRole: false,
        requestingCreatePermissionRole: false,
        successfulCreatePermissionRole: true,
        permissionRole: action.value,
      };
    case "CREATE_PERMISSION_ROLE_ERROR":
      return {
        ...state,
        errorsCreatePermissionRole: true,
        requestingCreatePermissionRole: false,
        successfulCreatePermissionRole: false,
      };
    case "READ_PERMISSION_ROLE_REQUESTING":
      return {
        ...state,
        requestingReadPermissionRole: true,
        successfulReadPermissionRole: false,
        errorsReadPermissionRole: false,
      };
    case "READ_PERMISSION_ROLE_SUCCESS":
      return {
        ...state,
        errorsReadPermissionRole: false,
        requestingReadPermissionRole: false,
        successfulReadPermissionRole: true,
        rowEdited: action.value,
      };
    case "READ_PERMISSION_ROLE_ERROR":
      return {
        ...state,
        errorsReadPermissionRole: true,
        requestingReadPermissionRole: false,
        successfulReadPermissionRole: false,
      };
    case "DELETE_PERMISSION_ROLE_REQUESTING":
      return {
        ...state,
        requestingDeletePermissionRole: true,
        successfulDeletePermissionRole: false,
        errorsDeletePermissionRole: false,
      };
    case "DELETE_PERMISSION_ROLE_SUCCESS":
      return {
        ...state,
        errorsDeletePermissionRole: false,
        requestingDeletePermissionRole: false,
        successfulDeletePermissionRole: true,
        rowDeleted: action.value,
      };
    case "DELETE_PERMISSION_ROLE_ERROR":
      return {
        ...state,
        errorsDeletePermissionRole: true,
        requestingDeletePermissionRole: false,
        successfulDeletePermissionRole: false,
      };
    case "UPDATE_PERMISSION_ROLE_REQUESTING":
      return {
        ...state,
        requestingUpdatePermissionRole: true,
        successfulUpdatePermissionRole: false,
        errorsUpdatePermissionRole: false,
      };
    case "UPDATE_PERMISSION_ROLE_SUCCESS":
      return {
        ...state,
        errorsUpdatePermissionRole: false,
        requestingUpdatePermissionRole: false,
        successfulUpdatePermissionRole: true,
        rowUpdated: action.value,
      };
    case "UPDATE_PERMISSION_ROLE_ERROR":
      return {
        ...state,
        errorsUpdatePermissionRole: true,
        requestingUpdatePermissionRole: false,
        successfulUpdatePermissionRole: false,
      };
    case "RESET_PERMISSION_ROLE_FORM":
      return {
        ...state,
        requestingCreatePermissionRole: false,
        successfulCreatePermissionRole: false,
        errorsCreatePermissionRole: false,
        permission: null,
        requestingReadPermissionRole: false,
        successfulReadPermissionRole: false,
        errorsReadPermissionRole: false,
        rowEdited: null,
        requestingDeletePermissionRole: false,
        successfulDeletePermissionRole: false,
        errorsDeletePermissionRole: false,
        rowDeleted: null,
        requestingUpdatePermissionRole: false,
        successfulUpdatePermissionRole: false,
        errorsUpdatePermissionRole: false,
        rowUpdated: null,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default permissionRoleReducer;
