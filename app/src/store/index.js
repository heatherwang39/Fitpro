import { createStore } from "redux";
import reducers from "../reducers";
import { User } from "../types";

const savedUser = () => {
    const unparsed = localStorage.getItem("savedUser");
    if (!unparsed) return null;
    return new User({ ...(JSON.parse(unparsed)) });
};

let user = savedUser();
let createdStore = null;

if (user === null) {
    createdStore = createStore(reducers);
} else {
    createdStore = createStore(reducers, { userReducer: savedUser() });
}

export const store = createdStore;

store.subscribe(() => {
    const { userReducer } = store.getState();
    if (user === userReducer) return;
    if (userReducer === null) {
        localStorage.removeItem("savedUser");
    } else {
        localStorage.setItem("savedUser", JSON.stringify(userReducer));
        user = new User({ ...userReducer });
    }
});

export default store;
