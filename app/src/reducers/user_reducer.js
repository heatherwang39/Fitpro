import {
    GOT_USER_INFO,
} from "../actions/action_types";

export default (state = null, action) => {
    switch (action.type) {
    case GOT_USER_INFO:
        return action.payload;
    default:
        return state;
    }
};
