import React from 'react';

const TrainerDetail = ({selectedTrainer}) => {
    if (selectedTrainer == null) return(<div />);
    return (
        <div className="ui card">
            <div className="content">
                <div className="header">{selectedTrainer.firstname} {selectedTrainer.lastname}</div>
                <div className="meta">Contact Information</div>
                <div className="description">
                    Email:{selectedTrainer.email}
                    <br />
                    Tel:{selectedTrainer.phone}
                    <br />
                    Location:{selectedTrainer.location}
                </div>
            </div>
        </div>
    )
};

export default TrainerDetail;