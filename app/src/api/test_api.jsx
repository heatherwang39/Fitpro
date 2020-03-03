// Simulated API calls that read static data from data.js

import {
    clientUser, client2User, trainerUser, clientCalendar, client2Calendar, trainerCalendar,
    trainerUser1, trainerUser2, trainerUser3, trainerUser4, exercise1, exercise2, exercise3,
    exercise4, client3User, client4User,
} from "./test_data";

let lastEventId = 10;

// Returns a big random id. This is used instead of actually keeping track of ids
// Probability of getting duplicate id in 2 sequential calls is at most 1/1000000
const randomId = () => Math.ceil(Math.random() * 1000000);

/*
 * Returns events for the next year for a given event and repeat frequency
 * This will be replaced with server calls that generate dates for more than 1 year
 * in Phase 2
 */
const repeatToEvents = (event, repeatVal, repeatType) => {
    let addToDate;
    switch (repeatType) {
    case "days":
        addToDate = (date) => new Date(date.getTime() + repeatVal * 86400000);
        break;
    case "weeks":
        addToDate = (date) => new Date(date.getTime() + repeatVal * 604800000);
        break;
    case "months":
        addToDate = (date) => {
            const newDate = new Date(date);
            newDate.setMonth(date.getMonth() + parseInt(repeatVal, 10));
            return newDate;
        };
        break;
    default:
        console.log("Invalid repeat frequency");
        return undefined;
    }
    let cur = event;
    const events = [];
    while (cur.start.getYear() === event.start.getYear()) {
        cur = {
            ...cur,
            start: addToDate(cur.start),
            end: addToDate(cur.end),
            id: randomId(),
        };
        events.push(cur);
    }
    return events;
};

const calendarWithNewEvent = (calendar, event) => {
    if (calendar == null) return null;
    const newCalendar = calendar;
    let notFound = true;
    for (let i = 0; i < newCalendar.events.length; i++) {
        if (newCalendar.events[i].id === event.id) {
            newCalendar.events[i] = event;
            notFound = false;
        }
    }
    if (notFound) {
        lastEventId++;
        const newEvent = event;
        newEvent.id = lastEventId;
        newCalendar.events.push(newEvent);
    }
    if (event.repeat) {
        newCalendar.events = newCalendar.events.concat(
            repeatToEvents(event, event.repeatFreq, event.repeatUnits),
        );
    }
    return newCalendar;
};

const calendarWithoutEvent = (calendar, event) => {
    if (calendar == null) return null;
    const newCalendar = calendar;
    newCalendar.events = calendar.events.filter((e) => e.id !== event.id);
    return newCalendar;
};


export const TestAPI = {
    searchExercise: async (exerciseName) => {
        switch (exerciseName) {
        case "Barbell Bench Press":
            return exercise1;
        case "Barbell Squat":
            return exercise2;
        case "Barbell Bent Over Row":
            return exercise3;
        case "Barbell Deaflit":
            return exercise4;
        default:
            console.log("INVALID EXERCISE NAME");
            return {};
        }
    },

    searchTrainer: async (firstname) => {
        switch (firstname) {
        case "Jamie":
            return trainerUser1;
        case "Mika":
            return trainerUser2;
        case "Andy":
            return trainerUser3;
        case "Ivy":
            return trainerUser4;
        default:
            console.log(`INVALID FIRSTNAME ${firstname}`);
            return {};
        }
    },

    getProfile: async (id) => {
        switch (id) {
        case 1:
            return { success: true, profile: clientUser };
        case 2:
            return { success: true, profile: trainerUser };
        case 3:
            return { success: true, profile: client2User };
        default:
            return { success: false, error: `Invalid user ID ${id}` };
        }
    },

    login: async (username, password) => {
        switch (username) {
        case "user":
            if (password !== "user") return { status: "Invalid password" };
            return { status: "success", user: clientUser };
        case "user2":
            if (password !== "user2") return { status: "Invalid password" };
            return { status: "success", user: trainerUser };
        default:
            return { status: "Invalid user" };
        }
    },

    getUserCalendar: async (id, token) => {
        (() => {
        })(token);
        switch (id) {
        case 1:
            return { success: true, userCalendar: clientCalendar };
        case 2:
            return {
                success: true,
                userCalendar: trainerCalendar,
                clientCalendars: [
                    {
                        id: 1,
                        firstname: "ClientFirst",
                        lastname: "ClientLast",
                        calendar: clientCalendar,
                    },
                    {
                        id: 3,
                        firstname: "Client2First",
                        lastname: "Client2Last",
                        calendar: client2Calendar,
                    },
                ],
            };
        case 3:
            return { success: true, userCalendar: client2Calendar };
        default:
            console.log(`User ID ${id} HAS NO CALENDAR`);
            return { success: false };
        }
    },

    deleteCalendarEvent: async (event, calendar) => ({
        success: true,
        calendar: calendarWithoutEvent(calendar, event),
    }),

    createCalendarEvent: async (event, calendar) => ({
        success: true,
        calendar: calendarWithNewEvent(calendar, event),
    }),

    registerUser: async (userInfo) => {
        switch (userInfo.accountType) {
        case "Client":
            return { success: true, user: clientUser };
        case "Trainer":
            return { success: true, user: trainerUser };
        default:
            return { success: true, user: clientUser };
        }
    },

    getRelationships: async (userInfo) => {
        if (userInfo.username.includes("user")) {
            return {
                success: true,
                clients: [clientUser, client2User, client3User, client4User],
                trainers: [trainerUser1],
            };
        }
        return { success: false };
    },

    updateProfile: async (profile) => ({ success: true, profile }),
};

export default TestAPI;
