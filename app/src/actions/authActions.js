import { LOGIN_USER, LOGIN_SUCCESS, LOGIN_FAILURE } from "./actionTypes";

/*
User = { username: STRING, password: STRING }
*/
export const loginUser = (creds) => ({
    type: LOGIN_USER,
    payload: creds,
});

export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user,
});

export const loginFailure = (user) => ({
    type: LOGIN_FAILURE,
    payload: user,
});

export default loginUser;
