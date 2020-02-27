import {
    TRAINER_SELECTED,TRAINER_SEARCH
} from "../actions/actionTypes";

const trainerlist =[
        {name:"Jamie",price:"30$ per hour",mail:"trainer@mail.com",tel:"555-123-4567",location:"Toronto",height:"6'3",weight:"220lb",goalType:"4"},
        {name:"Mika",price:"45$ per hour",mail:"trainer2@mail.com",tel:"555-555-4321",location:"Toronto",height:"6'1",weight:"190lb",goalType:"3.5"},
        {name:"Andy",price:"20$ per hour",mail:"trainer3@mail.com",tel:"555-555-6666",location:"Toronto",height:"6'2",weight:"200lb",goalType:"4.5"},
        {name:"Ivy",price:"15$ per hour",mail:"trainer4@mail.com",tel:"555-555-7777",location:"Toronto",height:"5'8",weight:"170lb",goalType:"4"}
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
