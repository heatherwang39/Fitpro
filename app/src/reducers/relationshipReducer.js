import {
    ADD_TRAINER, ADD_CLIENT, REMOVE_CLIENT, REMOVE_TRAINER,
} from "../actions/actionTypes";


const initialState = {
    trainers: [],
    clients: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ADD_TRAINER:
        return {
            clients: [...state.clients],
            trainers: [...action.payload],
        };
    case REMOVE_TRAINER:
        return {
            clients: [...state.clients],
            trainers: state.trainers.filter((trainerID) => trainerID !== action.payload),
        };
    case ADD_CLIENT:
        return {
            clients: [...action.payload],
            trainers: [...state.trainers],
        };
    case REMOVE_CLIENT:
        return {
            clients: state.clients.filter((clientID) => clientID !== action.payload),
            trainers: [...state.trainers],
        };
    default:
        return state;
    }
};
