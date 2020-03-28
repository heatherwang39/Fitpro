import { store } from "../store";
import { loggedOut } from "../actions/userActions";

const BASE_API_URL = "https://localhost:3333";
const apiUrl = (l) => `${BASE_API_URL + (!l || !l.length ? "" : (l[0] === "/" ? l : `/${l}`))}`;

/*
 * Wrapper around fetch API to send requests to BASE_API_URL/path with options options
 * If body is set to an object then it is converted to JSON and headers are set for JSON
 * Logs out user if request is made with invalid token
 *
 * path is a URL or a path relative to BASE_API_URL
 * options are fetch API options
 */
const apiFetch = async (path, options) => {
    const reqOptions = { ...options, credentials: "include" };
    if (options && options.body && typeof options.body !== "string") {
        reqOptions.body = JSON.stringify(options.body);
        reqOptions.headers = { "Content-type": "application/json; charset=UTF-8" };
    }
    const res = await fetch(path.startsWith("http") ? path : apiUrl(path), reqOptions);
    if (res.status === 401) {
        const valid = await fetch(apiUrl("auth/validate"), { credentials: "include" });
        console.log(valid, valid.status);
        if (valid.status === 401) {
            store.dispatch(loggedOut());
        }
    }
    return res;
};

const parseJsonWithDates = (json) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    return JSON.parse(json, (_, v) => (typeof v === "string" && dateRegex.test(v) ? new Date(v) : v));
};

export const API = {
    async getWorkout(id) {
        return (await apiFetch(`workouts?id=${id}`)).json();
    },
    async getWorkouts(filters, page) {
        let endpoint = "workouts";
        let addedParam = false;
        if (filters.myWorkouts) {
            endpoint += `${addedParam ? "&" : "?"}mine=true`;
            addedParam = true;
        }
        if (filters.name) {
            endpoint += `${addedParam ? "&" : "?"}name=${filters.name}`;
            addedParam = true;
        }
        const res = await apiFetch(endpoint);
        if (res.status !== 200) {
            return {
                status: res.status,
            };
        }
        return res.json();
    },
    async updateWorkout(newWorkout) {
        const res = await apiFetch("workouts", { method: "PATCH", body: newWorkout });
        if (res.status !== 200) return { status: res.status };
        return res.json();
    },
    async login(username, password) {
        const res = await apiFetch("auth/login", {
            method: "POST",
            body: { username, password },
        });
        if (res.status !== 200) return { status: res.status };
        const user = await res.json();
        return { status: "success", user };
    },
    async getProfile(id) {
        const res = await apiFetch(`users/${id}`);
        if (res.status !== 200) {
            return { success: false, error: res.status === 404 ? "Invalid user" : `Server returned ${res.status}` };
        }
        const r = { success: true, profile: await res.json() };
        console.log(r);
        return r;
    },
    async getUserCalendar(user) {
        let res = await apiFetch("events/mine");
        if (res.status !== 200) {
            return { success: false, error: `Server responded with ${res.status}` };
        }
        // TODO handle pagination of events
        const calendar = { myEvents: parseJsonWithDates(await res.text()).docs, clientEvents: {}, success: true };
        if (user.isTrainer) {
            res = await apiFetch("events/clients");
            if (res.status !== 200) {
                return { success: false, error: `Server responded with ${res.status} when getting client events` };
            }
            calendar.clientEventsList = (await res.json()).docs;
            calendar.clientEventsList.forEach((e) => {
                if (calendar.clientEvents[e.client]) {
                    calendar.clientEvents[e.client].push(e);
                } else {
                    calendar.clientEvents[e.client] = [e];
                }
            });
        }
        return calendar;
    },
    async createEvent(event) {
        const res = await apiFetch("events", { method: "POST", body: event });
        if (res.status !== 201) {
            return { success: false, error: `Server responded with ${res.status}` };
        }
        return { success: true, event: await res.json() };
    },
};

export default API;
