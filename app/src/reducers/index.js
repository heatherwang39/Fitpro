import { combineReducers } from "redux";
import calendarReducer from "./calendarReducer";
import userReducer from "./userReducer";
import exerciseReducer from "./exerciseReducer";


/* Combine all of the reducers here  */
export default combineReducers({
    calendarReducer,
    userReducer,
    exerciseReducer,
});
