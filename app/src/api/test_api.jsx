// Simulated API calls that read static data from data.js

import {
    clientUser, client2User, trainerUser, clientCalendar, client2Calendar, trainerCalendar,
    trainerUser1, trainerUser2, trainerUser3, trainerUser4, exercise1, exercise2, exercise3,
    exercise4,
} from "./test_data";

const calendarWithNewEvent = (calendar, event) => {
    if (calendar == null) return null;
    const newCalendar = calendar;
    newCalendar.events.push(event);
    return newCalendar;
};

const calendarWithoutEvent = (calendar, event) => {
    if (calendar == null) return null;
    const newCalendar = calendar;
    newCalendar.events = calendar.events.filter((e) => e.id !== event.id);
    return newCalendar;
};

const allTrainers = [trainerUser1, trainerUser2, trainerUser3, trainerUser4];

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

    searchTrainer: async (query) => {
        query.text = query.text.toLowerCase();
        const results = [];
        allTrainers.forEach((trainer) => {
            if (query.text != undefined && query.text.length > 0) {
                if (!trainer.firstname.toLowerCase().includes(query.text) &&
                    !trainer.lastname.toLowerCase().includes(query.text)) {
                    return;
                }
            }
            results.push(trainer);
        });
        return {
            success: true,
            results
        };
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

    updateProfile: async (profile) => ({ success: true, profile }),
};

export default TestAPI;
