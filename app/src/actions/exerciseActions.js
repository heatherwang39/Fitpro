import { SEARCH_EXERCISE} from "./actionTypes";

//create action when user search exercise
export const searchedExercise = (exercise) => ({
    type: SEARCH_EXERCISE,
    payload: exercise
});
