import {
    GET_USER_CALENDAR, GOT_USER_CALENDAR, UPDATED_CALENDAR,
} from "../actions/actionTypes";

const defaultState = {
    myEvents: null, //  Events for this user
    clientEvents: {}, // Events for clients of this user by client id
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
        };
    case UPDATED_CALENDAR: {
        if (action.payload.userId === state.userCalendar.userId) {
            return {
                ...state,
                userCalendar: action.payload,
            };
        }
        // Find the correct user id calendar in clientCalendars and update it
        const newCalendars = state.clientCalendars;
        let waitingAdd = true;
        for (let i = 0; i < newCalendars.length; i++) {
            if (newCalendars[i].id === action.payload.userId) {
                newCalendars[i].calendar = action.payload;
                waitingAdd = false;
            }
        }
        // If we didn't find a matching client calendar just push this as a new one
        // Probably should never happen though
        if (waitingAdd) {
            console.log("Warning: UPDATED_CALENDAR got a calendar which is not in clientCalendars ",
                "Adding this calendar as a new user's calendar");
            newCalendars.push(action.payload);
        }
        return {
            ...state,
            clientCalendars: newCalendars,
        };
    }
    default:
        return state;
    }
};
