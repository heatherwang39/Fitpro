/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import {
    Card, Form, Grid, Input, Radio,
} from "semantic-ui-react";
import TrainerList from "./TrainerList";
import Filter from "./Filter";
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

    render() {
        const { searchedName, filters } = this.state;
        console.log(filters);
        return (
            <div id="search-container">
                <Grid>
                    <Grid.Column className="filterContainer" width={4}>
                        <Filter filters={filters} setFilters={(f) => this.setState({ filters: f })} />
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <div className="searchBarContainer">
                            <Form onSubmit={(e) => { this.onFormSubmit(e); }}>
                                <Form.Field>
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
            </div>
        );
    }
}


export default SearchTrainer;
