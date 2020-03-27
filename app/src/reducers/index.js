import { combineReducers } from "redux";
import calendarReducer from "./calendarReducer";
import relationshipReducer from "./relationshipReducer";
import userReducer from "./userReducer";
import exerciseReducer from "./exerciseReducer";


/* Combine all of the reducers here  */
export default combineReducers({
    calendarReducer,
    relationshipReducer,
    userReducer,
    exerciseReducer,
});
