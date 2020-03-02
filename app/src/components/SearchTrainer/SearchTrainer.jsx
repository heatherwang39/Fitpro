import React, { Component } from "react";

import TrainerList from "./TrainerList";

import Filter from './Filter';
// import {searchedTrainerName} from '../../actions/trainerActions';
// import "./style.css";

class SearchTrainer extends Component {
    constructor(props) {
        super(props);
        this.state = { searchedName: null };
    }

    onFormSubmit(e) {
        e.preventDefault();
        this.setState({ searchedName: e.target.children[0].children[1].value });
    }

    render() {
        return (
            <div className="wrapper ui grid">
                <div className="filterContainer four wide column">
                    <Filter />
                </div>

                <div className="searchBarContainer twelve wide column">
                    <form onSubmit={(e) => { this.onFormSubmit(e); }} className="ui form">
                        <div className="field">
                            <h3>Search Trainers</h3>
                            <input
                                type="text"
                                placeholder="please enter name..."
                                onChange={(e) => { console.log(e.target.value); }}
                            />
                        </div>
                    </form>
                    <br />
                    <TrainerList searchedName={this.state.searchedName} />
                </div>
            </div>
        );
    }
}


export default SearchTrainer;
