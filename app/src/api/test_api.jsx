// Simulated API calls that read static data from data.js

import {
    clientUser, client2User, trainerUser, clientCalendar, client2Calendar, trainerCalendar,
    trainerUser1,trainerUser2,trainerUser3,trainerUser4, exercise1, exercise2, exercise3,
    exercise4
} from "./test_data";

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
            console.log(`INVALID FIRSTNAME ${name}`);
            return {};
        }
    },
    getProfile: async (id, token) => {
        (() => {
        })(token);
        switch (id) {
            case 1:
                return clientUser;
            case 2:
                return trainerUser;
            case 3:
                return client2User;
            default:
                console.log(`INVALID ID ${id}`);
                return {};
        }
    },

    login: async (username, password) => {
        switch (username) {
            case "user":
                if (password !== "user") return {status: "Invalid password"};
                return {status: "success", user: clientUser};
            case "user2":
                if (password !== "user2") return {status: "Invalid password"};
                return {status: "success", user: trainerUser};
            default:
                return {status: "Invalid user"};
        }
    },

    getUserCalendar: async (id, token) => {
        (() => {
        })(token);
        switch (id) {
            case 1:
                return clientCalendar;
            case 2:
                return trainerCalendar;
            case 3:
                return client2Calendar;
            default:
                console.log(`User ID ${id} HAS NO CALENDAR`);
                return null;
        }
    },

    deleteCalendarEvent: async (event, token) => ({success: true, event}),
    createCalendarEvent: async (event, token) => ({success: true, event}),

    getTrainerCalendars: async (id) => {
        if (id !== 2) {
            console.log("Currently only getting trainer calendar for id 2 is supported");
            return {success: false};
        }
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
    },
    registerUser: async (userInfo) => {
        switch (userInfo.accountType) {
            case "Client":
                return {success: true, user: clientUser};
            case "Trainer":
                return {success: true, user: trainerUser};
            default:
                return {success: true, user: clientUser};
        }
    },

};

export default TestAPI;
