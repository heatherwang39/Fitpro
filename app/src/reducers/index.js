import { combineReducers } from "redux";
import authReducer from "./authReducer";
import calendarReducer from "./calendarReducer";
import relationshipReducer from "./relationshipReducer";
import userReducer from "./userReducer";
import exerciseReducer from "./exerciseReducer";


/* Combine all of the reducers here  */
export default combineReducers({
    authReducer,
    calendarReducer,
    relationshipReducer,
    userReducer,
    exerciseReducer,
});
