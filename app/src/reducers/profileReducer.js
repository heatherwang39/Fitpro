import {
    GET_PROFILE, GOT_PROFILE,
} from "../actions/actionTypes";

const initialState = {
    user: null,
    gettingProfile: false,
};


export default (state = initialState, action) => {
    switch (action.type) {
    case GET_PROFILE:
        return {
            ...state,
            gettingProfile: true,
            user: null,
        };
    case GOT_PROFILE:
        return {
            ...state,
            gettingProfile: false,
            user: action.payload,
        };
    default:
        return state;
    }
};
