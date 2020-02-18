import { GET_PROFILE, GOT_PROFILE } from "./actionTypes";

export const getProfile = (id) => ({
    type: GET_PROFILE,
    payload: id,
});

export const gotProfile = (user) => ({
    type: GOT_PROFILE,
    payload: user,
});

export default gotProfile;
