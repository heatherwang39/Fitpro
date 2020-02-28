import React,{Component} from 'react';
import {connect} from 'react-redux';
import {selectedTrainerInfo,searchedTrainer} from '../../actions/trainerActions';
import faker from "faker";
import API from "../../api";

class TrainerList extends Component{
    renderList(){
        const trainerList=this.props.trainerList
        const searchedTrainerName=this.props.searchedTrainerName
        console.log(searchedTrainerName)

        //if user don't search anything,just show list of all trainers
        if(!searchedTrainerName){
            return (
                trainerList.map((trainer)=>{
                return(
                <div key={trainer.firstname} className="item">
                    <div className="ui small image">
                        <img alt='fake_avatar' src={faker.image.avatar()} />
                    </div>
                    <div className="content">
                        <a className="header">Name: {trainer.firstname} {trainer.lastname}</a>
                        <div className="meta"><span>Price:</span>$30 per hour</div>
                        <div className="description">
                            <p>
                            Height:{trainer.height} {' '} Weight:{trainer.weight}
                            <br/>
                            Rating:{trainer.rating}
                            </p>
                        </div>
                        <div className="extra">
                            <button onClick={()=>this.props.selectedTrainerInfo(trainer)} className="ui primary right floated button">
                            Select
                            </button>
                        </div>
                    </div>
                </div>)}
                )
        )}
        //if user search an unexisted trainer
        else {
            API.searchTrainer(searchedTrainerName).then((response)=>{
                console.log(response)
            }
            )                           
            }
    }


    render(){
        console.log(this.props)
        return (
        <div className="ui divided items">{this.renderList()}</div>         
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        trainerList:state.trainersReducer.trainerList,
        searchedTrainerName:state.trainersReducer.searchedTrainerName
    };
}

export default connect(mapStateToProps,{selectedTrainerInfo:selectedTrainerInfo,searchedTrainer:searchedTrainer})(TrainerList);




