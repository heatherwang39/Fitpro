import {
    SEARCH_EXERCISE
} from "../actions/actionTypes";

import {
    exercise1,exercise2,exercise3,exercise4
} from "../api/test_data";

const exerciselist =[
    exercise1,exercise2,exercise3,exercise4
    ]

const initialState = {
    searchedExercise:null, 
    exerciseList: exerciselist,
    exerciseSelected: null
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
