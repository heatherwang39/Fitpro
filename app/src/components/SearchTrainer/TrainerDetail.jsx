import React from 'react';
import {connect} from 'react-redux';

const TrainerDetail=({selectedTrainer})=>{
    if(!selectedTrainer){
        return<div>What more information about our trainer? Click SELECT to see details!</div>
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