import { LOGIN_USER, LOGOUT_USER, REGISTER_USER, LOGIN_SUCCESS, LOGIN_FAILURE } from "../actions/action_types"

const initialState = {
    loggedIN: false,
    loggingIn: false,
    user: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state, 
                user: action.payload, 
                loggingIn: true
            }
        case LOGOUT_USER:
            return {
                loggedIN: false,
                loggingIn: false
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggingIn: false,
                user: action.payload, 
                loggedIn: true
            }
        case LOGIN_FAILURE:
            return {
                loggingIn: false,
                loggedIN: false
            }
        default:
            return state
    }
}