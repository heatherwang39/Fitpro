import React from 'react';

const TrainerDetail = (props) => {
    console.log(this.props.selectedTrainer)
    return(<div>
    <h3>Details for:</h3>
    </div>)
};

export default TrainerDetail;

/*
if(!selectedTrainer){
        return<div>What more information about our trainer? Click SELECT to see details!</div>
    }
    return (
       
            <p>
                Name:{selectedTrainer.firstname} {selectedTrainer.lastname}
                <br/>
                Price:$30 per hour
                <br/>
                Email:{selectedTrainer.email}
                <br/>
                Tel:{selectedTrainer.phone}
                <br/>
                Location:{selectedTrainer.location}
            </p>
            
        </div>
    )
*/