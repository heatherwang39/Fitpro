import React,{Component} from 'react';
import {connect} from 'react-redux';

import ExerciseList from './ExerciseList';
//import TrainerDetail from './TrainerDetail';
import Filter from './Filter';
import {searchedExercise} from '../../actions/exerciseActions';




class SearchExercise extends Component{
    
    onFormSubmit(e) {
        e.preventDefault();
        this.props.searchedExercise(e.target.children[0].children[1].value);
    }
    
    render(){
        return (
            <div className="wrapper ui grid">
                <div className="filterContainer four wide column">
                    <Filter />
                </div>
                
                <div className="searchBarContainer nine wide column">
                    <form onSubmit={e=>{this.onFormSubmit(e)}} className="ui form">
                        <div className="field">
                            <h3>Search Exercise</h3> 
                            <input type='text' placeholder='please enter...' onChange={e=>{console.log(e.target.value)}} /> 
                        </div>
                    </form>               
                    <br/>              
                    <ExerciseList/>
                </div>

                <div className="detailsContainer three wide column">don't know what to show yet</div>
            </div>
            )
        }
    }

    
export default connect(null,{searchedExercise:searchedExercise})(SearchExercise);