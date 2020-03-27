import { loginFailure } from "../actions/authActions";

const BASE_API_URL = "https://localhost:3333";
const apiUrl = (l) => `${BASE_API_URL + (!l || !l.length ? "" : (l[0] === "/" ? l : `/${l}`))}`;

const nextPage = {
    events: null,
};

export const API = {
    async getWorkout(id) {
        return (await fetch(apiUrl(`workouts?id=${id}`))).json();
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

        const res = await fetch(apiUrl(endpoint));
        if (res.status !== 200) {
            return {
                status: res.status,
            };
        }
        return res.json();
    },
    async updateWorkout(newWorkout) {
        const res = await fetch(apiUrl("workouts"), {
            method: "PATCH",
            body: JSON.stringify(newWorkout),
            headers: { "Content-type": "application/json; charset=UTF-8" },
            credentials: "include",
        });
        if (res.status !== 200) return { status: res.status };
        return res.json();
    },
    async login(username, password) {
        const res = await fetch(apiUrl("auth/login"), {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
            credentials: "include",
        });
        if (res.status !== 200) return { status: res.status };
        return { status: "success", user: await res.json() };
    },
};

export default API;
