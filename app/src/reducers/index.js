import { combineReducers } from "redux";
import authReducer from "./auth_reducer";
import userReducer from "./user_reducer";


/* Combine all of the reducers here  */
export default combineReducers({
    authReducer,
    userReducer,
});
