// Simulated API calls that read static data from data.js

import {
    client2Calendar, client2User, clientCalendar, clientUser, trainerCalendar, trainerUser,
} from "./test_data";

export const TestAPI = {
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

    deleteCalendarEvent: async (event) => ({ success: true, event }),
    createCalendarEvent: async (event) => ({ success: true, event }),

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

};

export default TestAPI;
