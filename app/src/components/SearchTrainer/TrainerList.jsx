import React,{Component} from 'react';
import {connect} from 'react-redux';
import {gotTrainerInfo} from '../../actions/trainerActions';
import {Card} from "@material-ui/core";
import faker from "faker";

class TrainerList extends Component{
    renderList(){
        const nameList=this.props.trainerList.map(trainer=>trainer.name)
        
        if(!this.props.trainerSearch){
            return (
            this.props.trainerList.map((trainer)=>{
                return(
                <div key={trainer.name} className="item">
                    <div className="ui small image">
                        <img alt='fake_avatar' src={faker.image.avatar()} />
                    </div>
                    <div className="content">
                        <a className="header">Name: {trainer.name}</a>
                        <div className="meta"><span>Price:</span>{trainer.price}</div>
                        <div className="description">
                            <p>{trainer.mail},{trainer.tel}
                            <br/>
                            {trainer.location}</p>
                        </div>
                        <div className="extra">
                            <button onClick={()=>this.props.gotTrainerInfo(trainer)} className="ui primary right floated button">
                            Select
                            </button>
                        </div>
                    </div>
                </div>)}
                )
        )}else if(nameList.indexOf(this.props.trainerSearch)>-1){
            return(
            <div>
                <img alt='fake_avatar' src={faker.image.avatar()} />
                <strong>name:</strong> {this.props.trainerSearch}
                      
            </div>
                
            )}
         else {return <div>No results</div>}
        
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
        trainerSearch:state.trainersReducer.trainerSearch
    };
}

export default connect(mapStateToProps,{gotTrainerInfo:gotTrainerInfo})(TrainerList);




