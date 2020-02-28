import { TRAINER_SELECTED } from "./actionTypes";
import { TRAINER_SEARCH_NAME} from "./actionTypes";
import { TRAINER_SEARCH} from "./actionTypes";

//create action when user search trainer(by name)
export const searchedTrainer = (trainer) => ({
    type: TRAINER_SEARCH,
    payload: trainer
});

//create action when user search trainer(by name),return name only
export const searchedTrainerName = (trainerName) => ({
    type: TRAINER_SEARCH_NAME,
    payload: trainerName
});

//create action when user get several searching results and select one of them to see details
export const selectedTrainerInfo = (trainerInfo) => ({
    type: TRAINER_SELECTED,
    payload: trainerInfo
});


