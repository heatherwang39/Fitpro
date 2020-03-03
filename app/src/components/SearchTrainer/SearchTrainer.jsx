import React, { Component } from "react";
import TrainerList from "./TrainerList";
import {
    Form, Input, Radio,
} from "semantic-ui-react";


class SearchTrainer extends Component {
    constructor(props) {
        super(props);
        this.state = { searchedName: "", filters: {} };
    }

    onFormSubmit(e) {
        e.preventDefault();
        this.setState({ searchedName: e.target.children[0].children[1].value });
    }

    filter() {
        return (
            <div>
                <Form>
                    <Form.Group grouped>
                        <label>Min Rating:</label>
                        <Form.Field
                            control={Radio}
                            checked={this.state.filters.minRating === 4}
                            label="4.0"
                            onChange={() => this.setState(
                                {
                                ...this.state,
                                    filters: { ...this.state.filters, minRating: this.state.filters.minRating === 4 ? undefined : 4}
                            })}
                        />
                        <Form.Field
                            control={Radio}
                            checked={this.state.filters.minRating === 3.5}
                            label="3.5"
                            onChange={() => this.setState({...this.state, filters: { ...this.state.filters, minRating: 3.5 } })}
                        />
                        <Form.Field
                            control={Radio}
                            checked={this.state.filters.minRating === 3}
                            label="3.0"
                            onChange={() => this.setState({...this.state, filters: { ...this.state.filters, minRating: 3 } })}
                        />
                    </Form.Group>

                    <Form.Group grouped>
                        <label>Gender:</label>
                        <Form.Field
                            control={Radio}
                            checked={this.state.filters.gender === "male"}
                            label="Male"
                            onChange={() => this.setState({...this.state, filters: { ...this.state.filters, gender: "male" } })}
                        />
                        <Form.Field
                            control={Radio}
                            checked={this.state.filters.gender === "female"}
                            label="Female"
                            onChange={() => this.setState({...this.state, filters: { ...this.state.filters, gender: "female" } })}
                        />
                    </Form.Group>

                    <Form.Group grouped>
                        <label>Max Price:</label>
                        <Form.Field
                            control={Radio}
                            checked={this.state.filters.maxPrice === 40}
                            label="within $40 per hour"
                            onChange={() => this.setState({...this.state, filters: { ...this.state.filters, maxPrice: 40 } })}
                        />
                        <Form.Field
                            control={Radio}
                            checked={this.state.filters.maxPrice === 30}
                            label="within $30 per hour"
                            onChange={() => this.setState({...this.state, filters: { ...this.state.filters, maxPrice: 30 } })}
                        />
                        <Form.Field
                            control={Radio}
                            checked={this.state.filters.maxPrice === 20}
                            label="within $20 per hour"
                            onChange={() => this.setState({...this.state, filters: { ...this.state.filters, maxPrice: 20 } })}
                        />
                    </Form.Group>
                </Form>
            </div>
        )
        }

    render() {
        return (
            <div className="wrapper ui grid">
                <div className="filterContainer four wide column">
                    <div className="ui block header">
                        {this.filter()}
                    </div>
                </div>

                <div className="twelve wide column">
                    <div className="searchBarContainer">
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
                    </div>
                    <br />
                    <TrainerList searchedName={this.state.searchedName} filters={this.state.filters} />
                </div>
            </div>
        );
    }
}


export default SearchTrainer;
