import {
    GET_TRAINER_CALENDARS, GOT_TRAINER_CALENDARS,
    GET_USER_CALENDAR, GOT_USER_CALENDAR, UPDATED_USER_CALENDAR, ADD_USER_CALENDAR_EVENT, RM_USER_CALENDAR_EVENT,
} from "./actionTypes";

/* Fetching calendar */

export const getTrainerCalendars = (calendars) => ({
    type: GET_TRAINER_CALENDARS,
    payload: calendars,
});

export const gotTrainerCalendars = (calendars) => ({
    type: GOT_TRAINER_CALENDARS,
    payload: calendars,
});

export const getUserCalendar = (calendar) => ({
    type: GET_USER_CALENDAR,
    payload: calendar,
});

export const gotUserCalendar = (calendar) => ({
    type: GOT_USER_CALENDAR,
    payload: calendar,
});


/* Updating calendar */

export const addUserCalendarEvent = (event) => ({
    type: ADD_USER_CALENDAR_EVENT,
    payload: event,
});

export const rmUserCalendarEvent = (event) => ({
    type: RM_USER_CALENDAR_EVENT,
    payload: event,
});

export const updatedUserCalendar = (event) => ({
    type: UPDATED_USER_CALENDAR,
    payload: event,
});
