import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import forgotPasswordReducer from "./forgotPasswordReducer";
import resetPasswordReducer from "./resetPasswordReducer";
import countryReducer from "./countryReducer";
import departmentReducer from "./departmentReducer";
import cityReducer from "./cityReducer";
import roleReducer from "./roleReducer";
import neighborhoodReducer from "./neighborhoodReducer";
import permissionReducer from "./permissionReducer";
import userReducer from "./userReducer";
import permissionRoleReducer from "./permissionRoleReducer";
import alertReducer from "./alertReducer";
import loadingReducer from "./loadingReducer";
import permissionsReducer from "./permissionsReducer";
import authReducer from "./authReducer";
import { MenuOpenReducer } from './MenuOpenReducer';
import prbReducer from "./prbReducer";

export const rootReducer = combineReducers({
  loginState: loginReducer,
  forgotPasswordState: forgotPasswordReducer,
  resetPasswordState: resetPasswordReducer,
  countryState: countryReducer,
  departmentState: departmentReducer,
  cityState: cityReducer,
  roleState: roleReducer,
  neighborhoodState: neighborhoodReducer,
  permissionState: permissionReducer,
  userState: userReducer,
  permissionRoleState: permissionRoleReducer,
  alertState: alertReducer,
  loadingState: loadingReducer,
  permissions: permissionsReducer,
  auth: authReducer,
  menuState: MenuOpenReducer,
  prb: prbReducer,
});
