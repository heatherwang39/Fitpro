import { combineReducers } from "redux";
import authReducer from "./auth_reducer";


const defaultUser = {
    username: "username",
    firstname: "Firstname",
    lastname: "Lastname",
    isTrainer: false,
};

/* Combine all of the reducers here  */
export default combineReducers({
    authReducer,
    user: (user = defaultUser) => user,
});
