import {
    TRAINER_SELECTED,
} from "../actions/actionTypes";

export default (state = null, action) => {
    switch (action.type) {
    case TRAINER_SELECTED:
        return action.payload;
    default:
        return state;
    }
};
/**

import {combineReducers} from 'redux';
const trainerReducer =()=>{
    return[
        {name:'Jamie',price:'30'},
        {name:'Mika',price:'45'},
        {name:'Andy',price:'20'},
        {name:'Ivy',price:'15'}
    ];
};


const selectedTrainerReducer=(selectedTrainer=null,action)=>{
    if(action.type==='TRAINER_SELECTED'){
        return action.payload;
    }
    return selectedTrainer;
}

export default combineReducers({
    trainerlist:trainerReducer,
    selectedTrainer:selectedTrainerReducer
})
 */