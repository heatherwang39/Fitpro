import React,{Component} from 'react';
import {connect} from 'react-redux';
//import {selectedTrainerInfo,searchedTrainer} from '../../actions/trainerActions';
import faker from "faker";
//import API from "../../api";




class ExerciseList extends Component{
    render(){

        for(let i=0;i<10;i++){
            return (
            <div >Show information of :
                {this.props.searchedExercise}
            </div>         
        )}
    }
}

const mapStateToProps=(state)=>{
    return {
        searchedExercise:state.exerciseReducer.searchedExercise
    }
}

export default connect(mapStateToProps)(ExerciseList);