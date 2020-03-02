import React, { Component } from "react";
import { Input } from "semantic-ui-react";
import TrainerList from "./TrainerList";

import Filter from './Filter';
// import {searchedTrainerName} from '../../actions/trainerActions';
// import "./style.css";

class SearchTrainer extends Component {
    constructor(props) {
        super(props);
        this.state = { searchedName: "", filters: {} };
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
                            <Input
                                type="text"
                                placeholder="Search for a trainer..."
                                value={this.state.searchedName}
                                onChange={(_, v) => { this.setState({searchedName: v.value})}}
                            />
                        </div>
                    </form>
                    <br />
                    <TrainerList searchedName={this.state.searchedName} filters={this.state.filters} />
                </div>
            </div>
        );
    }
}


export default SearchTrainer;
