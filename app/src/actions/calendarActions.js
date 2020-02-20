import { GET_USER_CALENDAR, GOT_USER_CALENDAR, UPDATE_CALENDAR } from "./actionTypes";


export const updateCalendar = (calendar) => ({
    type: UPDATE_CALENDAR,
    payload: calendar,
});

export const getUserCalendar = (calendar) => ({
    type: GET_USER_CALENDAR,
    payload: calendar,
});

export const gotUserCalendar = (calendar) => ({
    type: GOT_USER_CALENDAR,
    payload: calendar,
});

export default updateCalendar;
