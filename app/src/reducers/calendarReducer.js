import {
    GET_USER_CALENDAR, GOT_USER_CALENDAR, UPDATED_CALENDAR,
} from "../actions/actionTypes";

const defaultState = {
    myEvents: null, //  Events where this user is owner
    myClientEvents: [], // Events where this user is a client
    gettingCalendar: false,
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
            ...state,
            gettingCalendar: false,
            myEvents: action.payload.myEvents ? action.payload.myEvents : [],
            myClientEvents: action.payload.myClientEvents ? action.payload.myClientEvents : [],
        };
    case UPDATED_CALENDAR:
        return {
            ...state,
            myEvents: action.payload.myEvents,
            myClientEvents: action.payload.myClientEvents ? action.payload.myClientEvents : [],
        };

    default:
        return state;
    }
};
