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

const calendarWithoutEvent = (calendar, event) => {
    if (calendar == null) return null;
    const newCalendar = calendar;
    newCalendar.events = calendar.events.filter((e) => e !== event);
    return newCalendar;
};

const calendarWithNewEvent = (calendar, event) => {
    if (calendar == null) return null;
    const newCalendar = calendar;
    newCalendar.events.push(event);
    return newCalendar;
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
        return {
            ...state,
            userCalendar: calendarWithNewEvent(state.userCalendar, action.payload),
            updatingCalendar: true,
        };
    case RM_CALENDAR_EVENT:
        return {
            ...state,
            userCalendar: calendarWithoutEvent(state.userCalendar, action.payload),
            updatingCalendar: true,
        };
    case UPDATED_CALENDAR:
        return {
            ...state,
            updatingCalendar: false,
        };
    default:
        return state;
    }
};
