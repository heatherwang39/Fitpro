import React,{Component} from 'react';
import {connect} from 'react-redux';

import TrainerList from './TrainerList';
import TrainerDetail from './TrainerDetail';
import Filter from './Filter';
import {searchTrainerInfo} from '../../actions/trainerActions';
import "./style.css";




class SearchTrainer extends Component{
    
    onFormSubmit(e) {
        e.preventDefault();
        this.props.searchTrainerInfo(e.target.children[0].children[1].value);
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
                            <h3>Search Trainers</h3> 
                            <input type='text' placeholder='please enter name...' onChange={e=>{console.log(e.target.value)}} /> 
                        </div>
                    </form>               
                    <br/>              
                    <TrainerList/>
                </div>

                <div className="detailsContainer three wide column"><TrainerDetail/></div>
            </div>
            )
        }
    }

    
export default connect(null,{searchTrainerInfo:searchTrainerInfo})(SearchTrainer);