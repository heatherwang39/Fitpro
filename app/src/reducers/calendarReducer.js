import {
    GET_USER_CALENDAR, GOT_USER_CALENDAR, UPDATED_CALENDAR,
} from "../actions/actionTypes";

const defaultState = {
    userCalendar: null,
    gettingCalendar: false,
    clientCalendars: null,
};


export default (state = defaultState, action) => {
    switch (action.type) {
    case GET_USER_CALENDAR:
        return {
            ...state,
            gettingCalendar: true,
        };
    case GOT_USER_CALENDAR:
        if (action.payload.clientCalendars) {
            return {
                ...state,
                gettingCalendar: false,
                userCalendar: action.payload.userCalendar,
                clientCalendars: action.payload.clientCalendars,
            };
        }
        return {
            ...state,
            userCalendar: action.payload.userCalendar,
            gettingCalendar: false,
            clientCalendars: [],
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
