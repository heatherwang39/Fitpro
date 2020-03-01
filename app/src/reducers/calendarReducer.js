import {
    ADD_CALENDAR_EVENT, GET_USER_CALENDAR, GOT_USER_CALENDAR, RM_CALENDAR_EVENT,
    UPDATED_CALENDAR,
} from "../actions/actionTypes";

const defaultState = {
    userCalendar: null,
    gettingCalendar: false,
    updatingCalendar: false,
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
            userCalendar: action.payload,
            gettingCalendar: false,
        };
    case ADD_CALENDAR_EVENT:
    case RM_CALENDAR_EVENT:
        return {
            ...state,
            updatingCalendar: true,
        };
    case UPDATED_CALENDAR: {
        if (action.payload.userId === state.userCalendar.userId) {
            return {
                ...state,
                updatingCalendar: false,
                userCalendar: action.payload,
            };
        }
        const newCalendars = state.clientCalendars;
        let waitingAdd = true;
        for (let i = 0; i < newCalendars.length; i++) {
            if (newCalendars.clientCalendars[i].userId === action.payload.userId) {
                newCalendars[i] = action.payload;
                waitingAdd = false;
            }
        }
        if (waitingAdd) {
            newCalendars.push(action.payload);
        }
        return {
            ...state,
            updatingCalendar: false,
            clientCalendars: newCalendars,
        };
    }
    default:
        return state;
    }
};
