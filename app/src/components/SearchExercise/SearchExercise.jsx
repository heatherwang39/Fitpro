import React,{Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ExerciseList from './Exercises/ExerciseList';
import Filter from './Layouts/Filter';
import Exercises from "./Exercises/ExerciseList";
import { muscles, exercises } from "../../api/test_exercises_data";
//import TrainerDetail from './TrainerDetail';
import {searchedExercise} from '../../actions/exerciseActions';




class SearchExercise extends Component{
    
    // onFormSubmit(e) {
    //     e.preventDefault();
    //     this.props.searchedExercise(e.target.children[0].children[1].value);
    // }
    
    state={
        exercises,
        exercise: []
    }

    getExercisesByMuscles() {
        return Object.entries(
          this.state.exercises.reduce((exercises, exercise) => {
            const { muscles } = exercise
    
            exercises[muscles] = exercises[muscles]
              ? [...exercises[muscles], exercise]
              : [exercise]
    
            return exercises
          }, {})
        )
      }

    handleCategorySelected = category => {
        this.setState({
            category
        })
    }

    handleExerciseSelected = id => {
        this.setState(({ exercises }) => ({
            exercise: exercises.find(ex => ex.id === id)
        }))
    }

    render(){
        const exercises = this.getExercisesByMuscles(),
        { category, exercise }=this.state

        return <Fragment>
            <Filter 
            category={category}
            muscles={muscles}
            onSelect={this.handleCategorySelected} />

            <Exercises 
            category={category}
            exercises={exercises}
            onSelect={this.handleExerciseSelected}
            exercise={exercise} />
        </Fragment>
            
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
    
export default connect(null,{searchedExercise:searchedExercise})(SearchExercise);