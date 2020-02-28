import { SEARCH_EXERCISE, EXERCISE_SELECTED} from "./actionTypes";

//create action when user search exercise
export const searchedExercise = (exercise) => ({
    type: SEARCH_EXERCISE,
    payload: exercise
});

//create action when user get several searching results and select one of them to see details
export const selectedExerciseInfo = (exerciseInfo) => ({
    type: EXERCISE_SELECTED,
    payload: exerciseInfo
});
