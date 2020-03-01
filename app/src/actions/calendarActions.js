import {
    GET_USER_CALENDAR, GOT_USER_CALENDAR, UPDATED_CALENDAR,
} from "./actionTypes";

/* Fetching calendar */

export const getUserCalendar = (calendar) => ({
    type: GET_USER_CALENDAR,
    payload: calendar,
});

export const gotUserCalendar = (calendar) => ({
    type: GOT_USER_CALENDAR,
    payload: calendar,
});

export const updatedCalendar = (calendar) => ({
    type: UPDATED_CALENDAR,
    payload: calendar,
});
