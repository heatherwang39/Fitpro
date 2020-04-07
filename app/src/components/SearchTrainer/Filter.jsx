import React, { Component } from "react";
import { PropTypes } from "prop-types";
import {
    Button, Card, Form, Input, Radio,
} from "semantic-ui-react";
import "./style.css";

const hasFilter = (f) => f.gender || f.maxPrice || f.minRating;

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: props.filters,
            setFilters: (f) => { props.setFilters(f); this.setState({ filters: f }); },
            maxPriceString: "",
            maxPriceError: false,
        };
    }

    render() {
        const {
            filters, setFilters, maxPriceString, maxPriceError,
        } = this.state;

        const setMaxPrice = (newMaxPriceString) => {
            this.setState({ maxPriceString: newMaxPriceString });
            let newMaxPrice;
            try {
                newMaxPrice = parseInt(newMaxPriceString, 10);
            } catch (e) {
                this.setState({ maxPriceError: true });
                return;
            }
            this.setState({ maxPriceError: false });
            if (newMaxPrice.length === 0) return;
            setFilters({ ...filters, maxPrice: newMaxPrice });
        };

        return (
            <Card id="filter-container">
                {hasFilter(filters) && (
                    <div className="center">
                        <Button type="button" onClick={() => setFilters({})} id="clear-filters-btn">Clear Filters</Button>
                    </div>
                )}
                <Form id="filter-form">
                    <Form.Group inline>
                        <label className="filter-label">Min Rating</label>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 10}
                                label="10"
                                onClick={() => setFilters({ ...filters, minRating: filters.minRating === 10 ? 0 : 10 })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 9}
                                label="9"
                                onClick={() => setFilters({ ...filters, minRating: filters.minRating === 9 ? 0 : 9 })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 8}
                                label="8"
                                onClick={() => setFilters({ ...filters, minRating: filters.minRating === 8 ? 0 : 8 })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 7}
                                label="7"
                                onClick={() => setFilters({ ...filters, minRating: filters.minRating === 7 ? 0 : 7 })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                checked={filters.minRating === 6}
                                label="6"
                                onClick={() => setFilters({ ...filters, minRating: filters.minRating === 6 ? 0 : 6 })}
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group inline>
                        <label className="filter-label">Gender</label>
                        <Form.Field id="gender-radio-field">
                            <Radio
                                checked={filters.gender === "male"}
                                label="Male"
                                onClick={() => setFilters({
                                    ...filters,
                                    gender: filters.gender === "male" ? undefined : "male",
                                })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                checked={filters.gender === "female"}
                                label="Female"
                                onClick={() => setFilters({
                                    ...filters,
                                    gender: filters.gender === "female" ? undefined : "female",
                                })}
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group inline>
                        <label className="filter-label">Max Price (Hourly)</label>
                        <Form.Field>
                            <Input value={maxPriceString} onChange={(_, v) => setMaxPrice(v.value)} error={maxPriceError} label="$" />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Card>
        );
    }
}


Filter.propTypes = {
    filters: PropTypes.shape({
        gender: PropTypes.string,
        minRating: PropTypes.number,
        maxPrice: PropTypes.number,
    }).isRequired,
    setFilters: PropTypes.func.isRequired,
};

export default Filter;
