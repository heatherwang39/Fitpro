// Simulated API calls that read static data from data.js

import {
    clientUser, trainerUser, clientCalendar, trainerCalendar,
} from "./test_data";

export const TestAPI = {
    getProfile: async (id) => {
        switch (id) {
        case 1:
            return clientUser;
        case 2:
            return trainerUser;
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
        default:
            console.log(`User ID ${id} HAS NO CALENDAR`);
            return null;
        }
    },

};

export default TestAPI;
