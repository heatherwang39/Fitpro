import { createStore } from "redux";
import reducers from "../reducers";
import { User } from "../types";

const savedUser = () => {
    const unparsed = localStorage.getItem("savedUser");
    if (!unparsed) return null;
    return User.fromJSON(JSON.parse(unparsed));
};

const user = savedUser();
let createdStore = null;

if (user !== null) {
    createdStore = createStore(reducers, { userReducer: savedUser() });
} else {
    createdStore = createStore(reducers);
}

export const store = createdStore;

store.subscribe(() => {
    const { userReducer } = store.getState();
    if (userReducer === null) {
        localStorage.removeItem("savedUser");
    } else {
        localStorage.setItem("savedUser", JSON.stringify(userReducer));
    }
});

export default store;
