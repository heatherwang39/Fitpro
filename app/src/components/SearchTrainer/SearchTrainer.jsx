import React from 'react';
import TrainerList from './TrainerList';


//import TrainergDetail from './TrainerDetail';

const SearchTrainer=()=>{
    return (
    <div>
        <label>Search Trainers</label>                    
        <input type='text' placeholder='please enter...'/>
        
        <TrainerList />
    </div>
   )
};


export default SearchTrainer;