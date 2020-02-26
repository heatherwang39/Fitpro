import {
    GOT_USER_INFO, LOGOUT_USER,
} from "../actions/actionTypes";

export default (state = null, action) => {
    switch (action.type) {
    case GOT_USER_INFO:
        return action.payload;
    case LOGOUT_USER:
        return null;
    default:
        return state;
    }
};
