import {
    LOGIN_USER, LOGOUT_USER, LOGIN_SUCCESS, LOGIN_FAILURE,
} from "../actions/actionTypes";

const initialState = {
    loggingIn: false,
    token: null,
};


export default (state = initialState, action) => {
    switch (action.type) {
    case LOGIN_USER:
        return {
            ...state,
            loggingIn: true,
        };
    case LOGOUT_USER:
        return {
            loggingIn: false,
            token: null,
        };
    case LOGIN_SUCCESS:
        return {
            ...state,
            loggingIn: false,
        };
    case LOGIN_FAILURE:
        return {
            loggingIn: false,
            token: null,
        };
    default:
        return state;
    }
};
