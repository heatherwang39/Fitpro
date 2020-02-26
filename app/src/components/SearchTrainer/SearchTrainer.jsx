import React,{Component} from 'react';
import {connect} from 'react-redux';
import TrainerList from './TrainerList';
import TrainerDetail from './TrainerDetail';
import {searchTrainerInfo} from '../../actions/trainerActions';




class SearchTrainer extends Component{
    
    onFormSubmit(e) {
        e.preventDefault();
        this.props.searchTrainerInfo(e.target.children[1].value);
    }
    
    render(){
        return (
            <div>
                <form onSubmit={e=>{this.onFormSubmit(e)}}>
                    <label>Search Trainers</label> 
                    <input type='text' placeholder='please enter...' onChange={e=>{console.log(e.target.value)}} /> 
                </form>               
                <br/>              
                <TrainerList/>
                <TrainerDetail/>
            </div>
        )
        }
    }

    
export default connect(null,{searchTrainerInfo:searchTrainerInfo})(SearchTrainer);