import {
    ADD_TRAINER, ADD_CLIENT, REMOVE_CLIENT, REMOVE_TRAINER,
} from "./actionTypes";

export const addClient = (clientID) => ({
    type: ADD_CLIENT,
    payload: clientID,
});

export const removeClient = (clientID) => ({
    type: REMOVE_CLIENT,
    payload: clientID,
});

export const addTrainer = (trainerID) => ({
    type: ADD_TRAINER,
    payload: trainerID,
});

export const removeTrainer = (trainerID) => ({
    type: REMOVE_TRAINER,
    payload: trainerID,
});
