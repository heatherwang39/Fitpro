/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import {
    Form, Grid, Input, Radio,
} from "semantic-ui-react";
import TrainerList from "./TrainerList";
import "./style.css";

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
        const { filters } = this.state;
        return (
            <div>
                <Form id="filter-form">
                    <Form.Group inline>
                        <label className="filter-label">Min Rating</label>
                        <Form.Field
                            className="filter-first-option"
                            control={Radio}
                            checked={filters.minRating === 4}
                            label="4"
                            onChange={() => this.setState((prevState) => ({
                                prevState,
                                filters: {
                                    ...prevState.filters,
                                    minRating: prevState.filters.minRating === 4 ? undefined : 4,
                                },
                            }))}
                        />
                        <Form.Field
                            control={Radio}
                            checked={filters.minRating === 3}
                            label="3"
                            onChange={() => this.setState((prevState) => ({
                                prevState,
                                filters: {
                                    ...prevState.filters,
                                    minRating: prevState.filters.minRating === 3 ? undefined : 3,
                                },
                            }))}
                        />
                        <Form.Field
                            control={Radio}
                            checked={filters.minRating === 2}
                            label="2"
                            onChange={() => this.setState((prevState) => ({
                                prevState,
                                filters: {
                                    ...prevState.filters,
                                    minRating: prevState.filters.minRating === 2 ? undefined : 2,
                                },
                            }))}
                        />
                    </Form.Group>

                    <Form.Group inline>
                        <label className="filter-label">Gender</label>
                        <Form.Field
                            control={Radio}
                            checked={filters.gender === "male"}
                            label="Male"
                            onChange={() => this.setState((prevState) => (
                                {
                                    ...prevState,
                                    filters: { ...prevState.filters, gender: "male" },
                                }))}
                        />
                        <Form.Field
                            control={Radio}
                            checked={filters.gender === "female"}
                            label="Female"
                            onChange={() => this.setState((prevState) => (
                                {
                                    ...prevState,
                                    filters: { ...prevState.filters, gender: "female" },
                                }))}
                        />
                    </Form.Group>

                    <Form.Group inline>
                        <label className="filter-label">Max Price (Hourly)</label>
                        <Form.Field
                            control={Radio}
                            checked={filters.maxPrice === 40}
                            label="$40"
                            onChange={() => this.setState((prevState) => (
                                {
                                    ...prevState,
                                    filters: { ...prevState.filters, maxPrice: 40 },
                                }))}
                        />
                        <Form.Field
                            control={Radio}
                            checked={filters.maxPrice === 30}
                            label="$30"
                            onChange={() => this.setState((prevState) => (
                                {
                                    ...prevState,
                                    filters: { ...prevState.filters, maxPrice: 30 },
                                }))}
                        />
                        <Form.Field
                            control={Radio}
                            checked={filters.maxPrice === 20}
                            label="$20"
                            onChange={() => this.setState((prevState) => (
                                {
                                    ...prevState,
                                    filters: { ...prevState.filters, maxPrice: 20 },
                                }))}
                        />
                    </Form.Group>
                </Form>
            </div>
        );
    }

    render() {
        const { searchedName, filters } = this.state;
        return (
            <Grid className="search-container">
                <Grid.Column className="filterContainer" width={4}>
                    <div className="filter-header">
                        {this.filter()}
                    </div>
                </Grid.Column>
                <Grid.Column width={12}>
                    <div className="searchBarContainer">
                        <Form onSubmit={(e) => { this.onFormSubmit(e); }} className="ui form">
                            <Form.Field>
                                <h3>Search Trainers</h3>
                                <Input
                                    type="text"
                                    placeholder="Search for a trainer..."
                                    value={searchedName}
                                    onChange={(_, v) => { this.setState({ searchedName: v.value }); }}
                                />
                            </Form.Field>
                        </Form>
                    </div>
                    <br />
                    <TrainerList searchedName={searchedName} filters={filters} />
                </Grid.Column>
            </Grid>
        );
    }
}


export default SearchTrainer;
