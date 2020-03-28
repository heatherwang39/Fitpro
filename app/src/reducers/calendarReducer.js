import {
    GET_USER_CALENDAR, GOT_USER_CALENDAR, UPDATED_CALENDAR,
} from "../actions/actionTypes";

const defaultState = {
    myEvents: null, //  Events for this user
    clientEvents: {}, // Events for clients of this user by client id
    clientEventsList: [], // All values in clientEvents for every client
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
            myEvents: action.payload.myEvents,
            clientEvents: action.payload.clientEvents ? action.payload.clientEvents : {},
            clientEventsList: action.payload.clientEventsList
                ? action.payload.clientEventsList
                : (action.payload.clientEvents
                    ? Object.keys(action.payload.clientEvents).map(
                        (c) => ({ ...action.payload.clientEvents[c], client: c }),
                    )
                    : []),
        };
    case UPDATED_CALENDAR:
        return {
            ...state,
            myEvents: action.payload.myEvents,
            clientEvents: action.payload.clientEvents ? action.payload.clientEvents : {},
            clientEventsList: action.payload.clientEventsList
                ? action.payload.clientEventsList
                : (action.payload.clientEvents
                    ? Object.keys(action.payload.clientEvents).map(
                        (c) => ({ ...action.payload.clientEvents[c], client: c }),
                    )
                    : []),
        };

    default:
        return state;
    }
};
