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
                return(<div key={trainer.name}>
                    <img alt='fake_avatar' src={faker.image.avatar()} />
                    <div>
                        <strong>name:</strong> {trainer.name} <strong>price:</strong>{trainer.price}
                        <button onClick={()=>this.props.gotTrainerInfo(trainer)}>
                        Select
                        </button>
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
        /*if(this.props.trainerSearch){
            return (
                this.props.trainerList.map((trainer)=>{
                    <div key={trainer.name}>
                        <img alt='fake_avatar' src={faker.image.avatar()} />
                        <div>
                            <strong>name:</strong> {trainer.name} <strong>price:</strong>{trainer.price}
                            <button onClick={()=>this.props.gotTrainerInfo(trainer)}>
                            Select
                            </button>
                        </div>
                    </div>}
                    )
            )
        }else{
            this.props.trainerList.map((trainer)=>{
                return <div>This is Jamie</div>
            })
        }*/
    }
    render(){
        console.log(this.props)
        return (
        <Card color="primary.main">{this.renderList()}</Card>         
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




