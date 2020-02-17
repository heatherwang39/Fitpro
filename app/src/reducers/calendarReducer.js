import { UPDATE_CALENDAR } from "../actions/actionTypes";

const initialState = {
    events: [],
    availability: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
    case UPDATE_CALENDAR:
        return {
            events: action.payload.events,
            availability: action.payload.availability,
        };
    default:
        return state;
    }
};
