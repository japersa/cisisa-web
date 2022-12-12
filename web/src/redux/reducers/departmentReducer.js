const initialState = {
  requestingFetchDepartments: false,
  successfulFetchDepartments: false,
  errorFetchDepartments: false,
  departments: {},
  requestingCreateDepartment: false,
  successfulCreateDepartment: false,
  errorsCreateDepartment: false,
  department: null,
  requestingReadDepartment: false,
  successfulReadDepartment: false,
  errorsReadDepartment: false,
  rowEdited: null,
  requestingDeleteDepartment: false,
  successfulDeleteDepartment: false,
  errorsDeleteDepartment: false,
  rowDeleted: null,
  requestingUpdateDepartment: false,
  successfulUpdateDepartment: false,
  errorsUpdateDepartment: false,
  rowUpdated: null,
  departmentsByCountry: [],
  requestingReadDepartmentsByCountry: false,
  successfulReadDepartmentsByCountry: false,
  errorsReadDepartmentsByCountry: false,
};

const departmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_DEPARTMENTS_REQUESTING":
      return {
        ...state,
        requestingFetchDepartments: true,
        successfulFetchDepartments: false,
        errorsFetchDepartments: false,
      };
    case "FETCH_DEPARTMENT_SUCCESS":
      return {
        ...state,
        errorFetchDepartments: false,
        requestingFetchDepartments: false,
        successfulFetchDepartments: true,
        departments: action.value,
      };
    case "FETCH_DEPARTMENT_ERROR":
      return {
        ...state,
        errorFetchDepartments: true,
        requestingFetchDepartments: false,
        successfulFetchDepartments: false,
      };
    case "CREATE_DEPARTMENT_REQUESTING":
      return {
        ...state,
        requestingCreateDepartment: true,
        successfulCreateDepartment: false,
        errorsCreateDepartment: false,
      };
    case "CREATE_DEPARTMENT_SUCCESS":
      return {
        ...state,
        errorsCreateDepartment: false,
        requestingCreateDepartment: false,
        successfulCreateDepartment: true,
        department: action.value,
      };
    case "CREATE_DEPARTMENT_ERROR":
      return {
        ...state,
        errorsCreateDepartment: true,
        requestingCreateDepartment: false,
        successfulCreateDepartment: false,
      };
    case "READ_DEPARTMENT_REQUESTING":
      return {
        ...state,
        requestingReadDepartment: true,
        successfulReadDepartment: false,
        errorsReadDepartment: false,
      };
    case "READ_DEPARTMENT_SUCCESS":
      return {
        ...state,
        errorsReadDepartment: false,
        requestingReadDepartment: false,
        successfulReadDepartment: true,
        rowEdited: action.value,
      };
    case "READ_DEPARTMENT_ERROR":
      return {
        ...state,
        errorsReadDepartment: true,
        requestingReadDepartment: false,
        successfulReadDepartment: false,
      };
    case "DELETE_DEPARTMENT_REQUESTING":
      return {
        ...state,
        requestingDeleteDepartment: true,
        successfulDeleteDepartment: false,
        errorsDeleteDepartment: false,
      };
    case "DELETE_DEPARTMENT_SUCCESS":
      return {
        ...state,
        errorsDeleteDepartment: false,
        requestingDeleteDepartment: false,
        successfulDeleteDepartment: true,
        rowDeleted: action.value,
      };
    case "DELETE_DEPARTMENT_ERROR":
      return {
        ...state,
        errorsDeleteDepartment: true,
        requestingDeleteDepartment: false,
        successfulDeleteDepartment: false,
      };
    case "UPDATE_DEPARTMENT_REQUESTING":
      return {
        ...state,
        requestingUpdateDepartment: true,
        successfulUpdateDepartment: false,
        errorsUpdateDepartment: false,
      };
    case "UPDATE_DEPARTMENT_SUCCESS":
      return {
        ...state,
        errorsUpdateDepartment: false,
        requestingUpdateDepartment: false,
        successfulUpdateDepartment: true,
        rowUpdated: action.value,
      };
    case "UPDATE_DEPARTMENT_ERROR":
      return {
        ...state,
        errorsUpdateDepartment: true,
        requestingUpdateDepartment: false,
        successfulUpdateDepartment: false,
      };
    case "RESET_DEPARTMENT_FORM":
      return {
        ...state,
        requestingCreateDepartment: false,
        successfulCreateDepartment: false,
        errorsCreateDepartment: false,
        department: null,
        requestingReadDepartment: false,
        successfulReadDepartment: false,
        errorsReadDepartment: false,
        rowEdited: null,
        requestingDeleteDepartment: false,
        successfulDeleteDepartment: false,
        errorsDeleteDepartment: false,
        rowDeleted: null,
        requestingUpdateDepartment: false,
        successfulUpdateDepartment: false,
        errorsUpdateDepartment: false,
        rowUpdated: null,
        requestingUpdateDepartment: false,
        successfulUpdateDepartment: false,
        errorsUpdateDepartment: false,
        rowUpdated: null,
        departmentsByCountry: [],
        requestingReadDepartmentsByCountry: false,
        successfulReadDepartmentsByCountry: false,
        errorsReadDepartmentsByCountry: false,
      };
    case "READBYCOUNTRY_DEPARTMENT_REQUESTING":
      return {
        ...state,
        requestingReadDepartmentsByCountry: true,
        successfulReadDepartmentsByCountry: false,
        errorsReadDepartmentsByCountry: false,
      };
    case "READBYCOUNTRY_DEPARTMENT_SUCCESS":
      return {
        ...state,
        errorsReadDepartmentsByCountry: false,
        requestingReadDepartmentsByCountry: false,
        successfulReadDepartmentsByCountry: true,
        departmentsByCountry: action.value,
      };
    case "READBYCOUNTRY_DEPARTMENT_ERROR":
      return {
        ...state,
        errorsReadDepartmentsByCountry: true,
        requestingReadDepartmentsByCountry: false,
        successfulDepartmentsByCountry: false,
      };
    case "RESET_BYCOUNTRY_DEPARTMENT":
      return {
        ...state,
        errorsReadDepartmentsByCountry: false,
        requestingReadDepartmentsByCountry: false,
        successfulReadDepartmentsByCountry: false,
        departmentsByCountry: [],
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export default departmentReducer;
