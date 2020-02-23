import {
    ADD_USER_CALENDAR_EVENT, GET_USER_CALENDAR, GOT_USER_CALENDAR, RM_USER_CALENDAR_EVENT, UPDATED_USER_CALENDAR,
} from "../actions/actionTypes";

const defaultState = {
    calendar: null,
    gettingCalendar: false,
    updatingCalendar: false,
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
        return {
            calendar: action.payload,
            gettingCalendar: false,
        };
    case ADD_USER_CALENDAR_EVENT:
        return {
            ...state,
            calendar: calendarWithNewEvent(state.calendar, action.payload),
            updatingCalendar: true,
        };
    case RM_USER_CALENDAR_EVENT:
        return {
            ...state,
            calendar: calendarWithoutEvent(state.calendar, action.payload),
            updatingCalendar: true,
        };
    case UPDATED_USER_CALENDAR:
        return {
            ...state,
            updatingCalendar: false,
        };
    default:
        return state;
    }
};
