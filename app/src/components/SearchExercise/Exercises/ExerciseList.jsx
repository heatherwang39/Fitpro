import React,{Component, Fragment} from 'react';
import {connect} from 'react-redux';
import { Grid, Paper, Typography, List } from '@material-ui/core';
import { ListItem, ListItemText } from '@material-ui/core';
//import {selectedTrainerInfo,searchedTrainer} from '../../actions/trainerActions';
//import faker from "faker";
//import API from "../../api";

const style = {
    Paper: {
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        height: 500,
        overflowY: 'auto'
    }
}

export default ({ 
    exercises, 
    category, 
    onSelect, 
    exercise: {
        id, 
        title= 'Welcome!', 
        description='Please seelect an exercise from the list on the left!'
    } }) =>
    <Grid container>
        <Grid item sm>
            <Paper style={style.Paper}>
                {exercises.map(([group, exercises]) => 
                    !category || category === group 
                        ?   <Fragment key={group} >
                                <Typography
                                    variant="h5"
                                    style={{textTransform: 'capitalize'}}
                                >
                                    {group}
                                </Typography>
                                <List component="ul">
                                    {exercises.map(({ id, title }) => 
                                        <ListItem
                                            key={id}
                                            button
                                            onClick={() => onSelect(id)}
                                        >
                                        <ListItemText primary={title}/>
                                        </ListItem>
                                    )}
                                </List>
                            </Fragment>
                        : null
                )}
            </Paper>
        </Grid>
        <Grid item sm>
            <Paper style={style.Paper}>
                <Typography variant="h2">
                    {title}
                </Typography>
                <Typography variant="subtitle1">
                    {description}
                </Typography>
            </Paper>
        </Grid>

    </Grid>


// class ExerciseList extends Component{
//     render(){

//         for(let i=0;i<10;i++){
//             return (
//             <div >Show information of :
//                 {this.props.searchedExercise}
//             </div>         
//         )}
//     }
// }

// const mapStateToProps=(state)=>{
//     return {
//         searchedExercise:state.exerciseReducer.searchedExercise
//     }
// }

// export default connect(mapStateToProps)(ExerciseList);