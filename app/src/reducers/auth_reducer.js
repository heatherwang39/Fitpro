import { LOGIN_USER, LOGOUT_USER, REGISTER_USER, LOGIN_SUCCESS, LOGIN_FAILURE } from "../actions/action_types"

const initialState = {
    loggedIN: false,
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
                ...state, 
                user: action.payload,
                loggingOut: true
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true
            }
        case LOGIN_FAILURE:
            return {
                loggedIN: false,
            }
        default:
            return state
    }
}