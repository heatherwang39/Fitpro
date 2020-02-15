import { combineReducers } from "redux";
import authReducer from "./auth_reducer";


/* Combine all of the reducers here  */
export default combineReducers({
    authReducer,
});
