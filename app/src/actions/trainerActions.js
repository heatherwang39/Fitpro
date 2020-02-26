import { TRAINER_SELECTED } from "./actionTypes";
import { TRAINER_SEARCH } from "./actionTypes";

//create action when user search trainer(by name)
export const searchTrainerInfo = (trainername) => ({
    type: TRAINER_SEARCH,
    payload: trainername
});

//create action when user get several searching results and select one of them to see details
export const gotTrainerInfo = (trainerInfo) => ({
    type: TRAINER_SELECTED,
    payload: trainerInfo
});


