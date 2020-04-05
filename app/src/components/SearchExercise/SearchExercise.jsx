import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Filter from "./Layouts/Filter";
import Exercises from "./Exercises/ExerciseList";
import { muscle } from "../../api/Exercise_data";
// import TrainerDetail from './TrainerDetail';
import { searchedExercise } from "../../actions/exerciseActions";
// import API from "../../api/api";

const style = {
    Input: {
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 50,
        width: 500,
        height: 30,
    },
};

class SearchExercise extends Component {
    // onFormSubmit(e) {
    //     e.preventDefault();
    //     this.props.searchedExercise(e.target.children[0].children[1].value);
    // }

    state={
        exercises: [],
        exercise: [],
        paramData: [],
        search: "",
    }

    componentDidMount() {
        axios.get("/api/exercises").then((res) => {
            this.setState({ exercises: res.data });
        }).catch((error) => {
            console.log(error);
        });
    }

    getExercisesByMuscles() {
        return Object.entries(
            this.state.exercises.reduce((exercises, exercise) => {
                const { muscle } = exercise;

                exercises[muscle] = exercises[muscle]
                    ? [...exercises[muscle], exercise]
                    : [exercise];

                return exercises;
            }, {}),
        );
    }

    handleCategorySelected = (category) => {
        this.setState({
            category,
        });
    }

    handleExerciseSelected = (_id) => {
        this.setState(({ exercises }) => ({
            exercise: exercises.find((ex) => ex._id === _id),
        }));
    }

    onChange = (e) => {
        this.setState({ search: e.target.value });
    }

    render() {
        const exerciseArray = this.getExercisesByMuscles();
        const { exercises, category, exercise, search } = this.state;

        const filteredExercises = exercises.filter((exercise) => {
            return exercise.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });

        return (
            <>
                <form onSubmit={(e) => { this.onFormSubmit(e); }}>
                    <div className="field">
                        <h3>Search Exercise:</h3>
                        <input
                            type="text"
                            placeholder="please enter..."
                            style={style.Input}
                            onChange={this.onChange}
                        />
                    </div>
                </form>
                <Filter
                    category={category}
                    muscles={muscle}
                    onSelect={this.handleCategorySelected}
                />

                <Exercises
                    category={category}
                    exercises={exerciseArray}
                    onSelect={this.handleExerciseSelected}
                    exercise={exercise}
                    filteredExercises={filteredExercises}
                />
            </>
        );

        // <div className="wrapper ui grid">
        //     <div className="filterContainer four wide column">
        //         <Filter />
        //     </div>

        //     <div className="searchBarContainer nine wide column">
        //         <form onSubmit={e=>{this.onFormSubmit(e)}} className="ui form">
        //             <div className="field">
        //                 <h3>Search Exercise</h3>
        //                 <input type='text' placeholder='please enter...' onChange={e=>{console.log(e.target.value)}} />
        //             </div>
        //         </form>
        //         <br/>
        //         <ExerciseList/>
        //     </div>

        //     <div className="detailsContainer three wide column">don't know what to show yet</div>
        // </div>
    }
}

export default connect(null, { searchedExercise })(SearchExercise);
