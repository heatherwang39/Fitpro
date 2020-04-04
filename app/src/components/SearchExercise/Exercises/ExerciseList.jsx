import React, { Fragment } from "react";
import {
    Grid, Paper, Typography, List, ListItem, ListItemText,
} from "@material-ui/core";
import PropTypes from "prop-types";
// import {selectedTrainerInfo,searchedTrainer} from '../../actions/trainerActions';
// import faker from "faker";
// import API from "../../api";

const style = {
    Paper: {
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        height: 500,
        overflowY: "auto",
    },
    Font: {
        textTransform: "capitalize",
    },
};

const ExerciseList = ({
    exercises,
    category,
    onSelect,
    exercise: {
        id,
        title = "Welcome!",
        description = "Please seelect an exercise from the list on the left!",
    },
}) => (
    <Grid container>
        <Grid item sm>
            <Paper style={style.Paper}>
                {exercises.map(([group, exercises]) => (!category || category === group
                    ? (
                        <Fragment key={group}>
                            <Typography
                                variant="h5"
                                style={style.Font}
                            >
                                {group}
                            </Typography>
                            <List component="ul">
                                {exercises.map(({ id, title }) => (
                                    <ListItem
                                        key={id}
                                        button
                                        onClick={() => onSelect(id)}
                                    >
                                        <ListItemText primary={title} />
                                    </ListItem>
                                ))}
                            </List>
                        </Fragment>
                    )
                    : null))}
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
);

ExerciseList.propTypes = {
    exercises: PropTypes.array.isRequired,
    category: PropTypes.any.isRequired,
    onSelect: PropTypes.func.isRequired,
    exercise: PropTypes.array.isRequired,
};

export default ExerciseList;
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
