import {
    SEARCH_EXERCISE
} from "../actions/actionTypes";


const initialState = {
    searchedExercise:null, 
    };

export default (state = initialState, action) => {
    switch (action.type) {
    case SEARCH_EXERCISE:
        return {
            ...state,
            searchedExercise: action.payload,
        };
    default:
        return state;
    }
};    
