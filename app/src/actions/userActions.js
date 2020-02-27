import { GOT_USER_INFO, LOGOUT_USER } from "./actionTypes";

export const gotUserInfo = (userInfo) => ({
    type: GOT_USER_INFO,
    payload: userInfo,
});

export const loggedOut = (user) => ({
    type: LOGOUT_USER,
    payload: user,
});
