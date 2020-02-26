import React from 'react';
import {connect} from 'react-redux';

const TrainerDetail=({selectedTrainer})=>{
    if(!selectedTrainer){
        return<div>select a Trainer</div>
    }
    return (
        <div>
            <h3>Details for:</h3>
            <p>
                Name:{selectedTrainer.name}
                <br/>
                Price:{selectedTrainer.price}
            </p>
            
        </div>
    )
};

const mapStateToProps=(state)=>{
    return {selectedTrainer:state.trainersReducer.trainerSelected}
};


export default connect(mapStateToProps)(TrainerDetail);