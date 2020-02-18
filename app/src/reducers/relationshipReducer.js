import {
    ADD_TRAINER, ADD_CLIENT, REMOVE_CLIENT, REMOVE_TRAINER,
} from "../actions/actionTypes";


const initialState = {
    trainer: [],
    client: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ADD_TRAINER:
        return {
            client: [...state.client],
            trainer: [...state.trainer, action.payload],
        };
    case REMOVE_TRAINER:
        return {
            client: [...state.client],
            trainer: state.trainer.filter((trainerID) => trainerID !== action.payload),
        };
    case ADD_CLIENT:
        return {
            client: [...state.client, action.payload],
            trainer: [...state.trainer],
        };
    case REMOVE_CLIENT:
        return {
            client: state.client.filter((clientID) => clientID !== action.payload),
            trainer: [...state.trainer],
        };
    default:
        return state;
    }
};
