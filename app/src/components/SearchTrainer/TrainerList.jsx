import React,{Component} from 'react';
import {connect} from 'react-redux';
import {trainerActions} from '../../actions/trainerActions';// why need actionTypes?
//import {selectTrainer} from '../actions';
import Box from "@material-ui/core/Box";



const trainerlist=[
    {name:'Jamie',price:'30'},
    {name:'Mika',price:'45'},
    {name:'Andy',price:'20'},
    {name:'Ivy',price:'15'}
];

class TrainerList extends Component{
    renderList(){
        return trainerlist.map((trainer)=>{
            return(
                <div key={trainer.name}>
                    <div>
                        <strong>name:</strong> {trainer.name} <strong>price:</strong>{trainer.price}
                        <button>
                            Select
                        </button>
                    </div>
                </div>
            )
        })
    }
    render(){
        return (
        <Box color="primary.main">{this.renderList()}</Box>         
        )
    }
}


export default connect()(TrainerList);
/***
const mapStateToProps=(state)=>{
    return {trainerlist:state.trainerlist};
}

 */



