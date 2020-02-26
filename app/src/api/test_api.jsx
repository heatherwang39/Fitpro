// Simulated API calls that read static data from data.js

import {
    clientUser, client2User, trainerUser, clientCalendar, client2Calendar, trainerCalendar,
} from "./test_data";

export const TestAPI = {
    getProfile: async (id) => {
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
            if (password !== "user") return { status: "Invalid password" };
            return { status: "success", user: clientUser };
        case "user2":
            if (password !== "user2") return { status: "Invalid password" };
            return { status: "success", user: trainerUser };
        default:
            return { status: "Invalid user" };
        }
    },

    getUserCalendar: async (id) => {
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

    rmUserCalendarEvent: async (user, event) => ({ success: true, event, user }),
    addUserCalendarEvent: async (user, event) => ({ success: true, event, user }),

    getTrainerCalendars: async (id) => {
        if (id !== 2) {
            console.log("Currently only getting trainer calendar for id 2 is supported");
            return { success: false };
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

};

export default TestAPI;
