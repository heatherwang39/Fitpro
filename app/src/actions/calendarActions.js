import { UPDATE_CALENDAR } from "./actionTypes";


export const updateCalendar = (calendar) => ({
    type: UPDATE_CALENDAR,
    payload: calendar,
});

export default updateCalendar;
