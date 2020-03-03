/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import {
    Card, Form, Grid, Input, Radio,
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
            <Card id="filter-container">
                <Form id="filter-form">
                    <Form.Group inline>
                        <label className="filter-label">Min Rating</label>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 5}
                                label="5"
                                onClick={() => this.setState((prevState) => ({
                                    ...prevState,
                                    filters: {
                                        ...prevState.filters,
                                        minRating: prevState.filters.minRating === 5 ? 0 : 5,
                                    },
                                }))}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 4}
                                label="4"
                                onClick={() => this.setState((prevState) => ({
                                    ...prevState,
                                    filters: {
                                        ...prevState.filters,
                                        minRating: prevState.filters.minRating === 4 ? 0 : 4,
                                    },
                                }))}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 3}
                                label="3"
                                onClick={() => this.setState((prevState) => ({
                                    ...prevState,
                                    filters: {
                                        ...prevState.filters,
                                        minRating: prevState.filters.minRating === 3 ? 0 : 3,
                                    },
                                }))}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 2}
                                label="2"
                                onClick={() => this.setState((prevState) => ({
                                    ...prevState,
                                    filters: {
                                        ...prevState.filters,
                                        minRating: prevState.filters.minRating === 2 ? 0 : 2,
                                    },
                                }))}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 1}
                                label="1"
                                onClick={() => this.setState((prevState) => ({
                                    ...prevState,
                                    filters: {
                                        ...prevState.filters,
                                        minRating: prevState.filters.minRating === 1 ? 0 : 1,
                                    },
                                }))}
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group inline>
                        <label className="filter-label">Gender</label>
                        <Form.Field id="gender-radio-field">
                            <Radio
                                checked={filters.gender === "male"}
                                label="Male"
                                onClick={() => this.setState((prevState) => ({
                                    ...prevState,
                                    filters: {
                                        ...prevState.filters,
                                        gender: prevState.filters.gender === "male" ? undefined : "male",
                                    },
                                }))}
                            />
                        </Form.Field>
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
            </Card>
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
