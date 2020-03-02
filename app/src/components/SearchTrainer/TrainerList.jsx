import React, { Component } from "react";
import PropTypes from "prop-types";
import faker from "faker";

import TrainerDetail from "./TrainerDetail";
import {
    trainerUser1, trainerUser2, trainerUser3, trainerUser4,
} from "../../api/test_data";

const trainerList = [
    trainerUser1, trainerUser2, trainerUser3, trainerUser4,
];

class TrainerList extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedTrainer: null };
    }

    showList() {
        return (trainerList.map((trainer) => {
            return(
                <div key={trainer.firstname} className="item">
                    <div className="ui small image">
                        <img alt="fake_avatar" src={faker.image.avatar()} />
                    </div>
                    <div className="content">
                        <a className="header">
                            Name:
                            {trainer.firstname}
                            {trainer.lastname}
                        </a>
                        <div className="meta">
                            <span>Price:</span>
                            $30 per hour
                        </div>
                        <div className="description">
                            <p>
                                Height:
                                {trainer.height}
                                Weight:
                                {trainer.weight}
                                <br />
                                Rating:
                                {trainer.rating}
                            </p>
                        </div>
                        <div className="extra">
                            <button
                                type="button"
                                onClick={() => this.setState({ selectedTrainer: trainer })}
                                className="ui black right floated button">
                                Select
                            </button>
                        </div>
                    </div>
                </div>
            );
        })
        );
    }

    showOne() {
        const searchTrainerByName = (trainer) => {
            return trainer.firstname === this.props.searchedName
        };
        const searchedTrainer = trainerList.filter(searchTrainerByName);
        console.log(searchedTrainer[0])
    }

    render() {
        console.log(trainerList);
        return (
            <div className="wrapper ui grid">
                <div className="filterContainer ten wide column">
                    <div className="ui divided items">{this.showList()}</div>
                </div>
                <div className="searchBarContainer three wide column">
                    <TrainerDetail selectedTrainer={this.state.selectedTrainer} />
                </div>
            </div>
        );
    }
}
/*
const TrainerList = (props) => {
    const TrainerListProps = props;
    return (
        <div>{ TrainerListProps.searchedName }</div>
    );
};

TrainerList.defaultProps = {
    TrainerListProps: {},
    searchedName: null,
};

TrainerList.propTypes = {
    TrainerListProps: PropTypes.object,
    searchedName: PropTypes.string,
};


/*
renderList() {
        const { trainerList } = this.props;
        const { searchedTrainerName } = this.props;
        console.log(searchedTrainerName);

        // if user don't search anything,just show list of all trainers
        if (!searchedTrainerName) {
            return (
                trainerList.map((trainer) => (
                    <div key={trainer.firstname} className="item">
                        <div className="ui small image">
                            <img alt="fake_avatar" src={faker.image.avatar()} />
                        </div>
                        <div className="content">
                            <a className="header">
                                Name:
                                {trainer.firstname}
                                {trainer.lastname}
                            </a>
                            <div className="meta">
                                <span>Price:</span>
                                $30 per hour
                            </div>
                            <div className="description">
                                <p>
                                    Height:
                                    {trainer.height}
                                    {" "}
                                    {" "}
                                    {" "}
                                    Weight:
                                    {trainer.weight}
                                    <br />
                                    Rating:
                                    {trainer.rating}
                                </p>
                            </div>
                            <div className="extra">
                                <button
                                onClick={() => this.props.selectedTrainerInfo(trainer)}
                                className="ui primary right floated button">
                                    Select
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            );
        }
        // if user search an unexisted trainer

        API.searchTrainer(searchedTrainerName).then((response) => {
            console.log(response);
        });
    }


    render() {
        console.log(this.props);
        return (
            <div className="ui divided items">{this.renderList()}</div>
        );
    }
}

const mapStateToProps = (state) => ({
    trainerList: state.trainersReducer.trainerList,
    searchedTrainerName: state.trainersReducer.searchedTrainerName,
});

export default connect(mapStateToProps, { selectedTrainerInfo, searchedTrainer })(TrainerList);
*/
export default TrainerList;
