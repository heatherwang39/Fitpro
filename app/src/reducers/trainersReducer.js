import {
    TRAINER_SELECTED,TRAINER_SEARCH
} from "../actions/actionTypes";

const trainerlist =[
        {name:'Jamie',price:'30'},
        {name:'Mika',price:'45'},
        {name:'Andy',price:'20'},
        {name:'Ivy',price:'15'}
    ]
const initialState = {
    trainerSearch:null, 
    trainerList: trainerlist,
    trainerSelected: null,
    };

export default (state = initialState, action) => {
    switch (action.type) {
    case TRAINER_SEARCH:
        return {
            ...state,
            trainerSearch: action.payload,
        };
    case TRAINER_SELECTED:
        return {
            ...state,
            trainerSelected: action.payload,
        };
    default:
        return state;
    }
};    
