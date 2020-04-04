import { store } from "../store";
import { loggedOut } from "../actions/userActions";
import { CalendarEvent, User } from "../types";

const BASE_API_URL = "http://localhost:3333";
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
    async getWorkouts(filters) {
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
        return { success: true, workout: await res.json() };
    },
    async createWorkout(newWorkout) {
        const res = await apiFetch("workouts", { method: "POST", body: newWorkout });
        if (res.status !== 201) return { status: res.status };
        return { success: true, workout: await res.json() };
    },
    async login(username, password) {
        const res = await apiFetch("auth/login", {
            method: "POST",
            body: { username, password },
        });
        if (res.status !== 200) return { status: res.status };
        const user = await res.json();
        return { status: "success", user: new User({ id: user._id, ...user }) };
    },
    async logout() {
        return apiFetch("auth/logout");
    },
    async getProfile(id) {
        const res = await apiFetch(`users/${id}`);
        if (res.status !== 200) {
            return { success: false, error: res.status === 404 ? "Invalid user" : `Server returned ${res.status}` };
        }
        const r = { success: true, profile: await res.json() };
        return r;
    },
    async getUserCalendar(user) {
        let res = await apiFetch("events/mine");
        if (res.status !== 200) {
            return { success: false, error: `Server responded with ${res.status}` };
        }
        // TODO handle pagination of events
        const calendar = {
            myEvents: parseJsonWithDates(await res.text()).docs.map((e) => (new CalendarEvent({ ...e }))),
            myClientEvents: [],
            success: true,
        };
        if (!user.isTrainer) {
            res = await apiFetch("events/clients");
            if (res.status !== 200) {
                return { success: false, error: `Server responded with ${res.status} when getting client events` };
            }
            calendar.myClientEvents = parseJsonWithDates(await res.text()).docs;
        }
        return { success: true, calendar };
    },
    async createEvent(event) {
        const res = await apiFetch("events", { method: "POST", body: event });
        if (res.status !== 201) {
            return { success: false, error: `Server responded with ${res.status}` };
        }
        return { success: true, event: new CalendarEvent(parseJsonWithDates(await res.text())) };
    },
    async deleteEvent(event) {
        if (!event.id) return { success: false, error: "No event id" };
        const res = await apiFetch("events", { method: "DELETE", body: event });
        if (res.status !== 200) {
            return { success: false, error: `Server responded with ${res.status}` };
        }
        return { success: true, event: new CalendarEvent(parseJsonWithDates(await res.text())) };
    },
    async searchExercises({ name, page }) {
        if (!name || page < 1) return { success: false };
        const res = await apiFetch(`exercises?name=${name}&page=${page}`);
        if (res.status !== 200) {
            return { success: false };
        }
        return { success: true, exercises: await res.json() };
    },
    async getMail() {
        const res = await apiFetch("mail");
        if (res.status !== 200) {
            return { success: false };
        }
        return { success: true, mail: (await res.json()).docs };
    },
    async sendMail(content) {
        const res = await apiFetch("mail", {
            method: "POST",
            body: content,
        });
        if (res.status !== 200) {
            return { success: false };
        }
        return { success: true };
    },
    async getRating({ exercise, trainer, workout }) {
        let path;
        if (exercise) {
            path = `/ratings/exercise/${exercise}`;
        } else if (trainer) {
            path = `/ratings/trainer/${trainer}`;
        } else {
            path = `/ratings/workout/${workout}`;
        }
        const res = await apiFetch(path);
        if (res.status === 200) return { rating: parseInt(await res.text(), 10) };
        return {};
    },
    async setRating({
        exercise, trainer, workout, rating, review,
    }) {
        let body;
        if (exercise) {
            body = { rating, exercise };
        } else if (workout) {
            body = { rating, workout };
        } else if (review) {
            body = { rating, review, trainer };
        } else {
            body = { rating, trainer };
        }
        const res = await apiFetch("ratings", { method: "POST", body });
        if (res.status === 200) return { success: true };
        return {};
    },
    async removeRating({
        exercise, trainer, workout,
    }) {
        const body = { exercise, trainer, workout };
        const res = await apiFetch("ratings", { method: "DELETE", body });
        if (res.status === 200) return { success: true };
        return {};
    },
};

export default API;
