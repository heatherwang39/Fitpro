import { GET_USER_CALENDAR, GOT_USER_CALENDAR, UPDATE_CALENDAR } from "../actions/actionTypes";

const defaultState = {
    calendar: null,
    gettingCalendar: false,
    updatingCalendar: false,
};

export default (state = defaultState, action) => {
    switch (action.type) {
    case GET_USER_CALENDAR:
        return {
            ...state,
            gettingCalendar: true,
        };
    case GOT_USER_CALENDAR:
        return {
            calendar: action.payload,
            gettingCalendar: false,
        };
    case UPDATE_CALENDAR:
        return {
            ...state,
            updatingCalendar: true,
        };
    default:
        return state;
    }
};
