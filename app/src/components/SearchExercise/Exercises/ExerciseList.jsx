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
    PaperResult: {
        padding: 20,
        marginBottom: 10,
        height: 200,
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
        _id,
        name = "Welcome!",
        description = "Please select an exercise from the list on the left!",
        benefits = [],
        type,
        muscle,
        equipment,
        level,
        rating,
        images = [],
    },
    filteredExercises,
}) => (
    <Grid container>
        <Grid item xs={12}>
            <Typography
                variant="h5"
                style={style.Font}
            >
                Search Results:
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Paper style={style.PaperResult}>
                {filteredExercises.map(({ _id, name }) => (
                    <List component="ul">
                        <ListItem
                            key={_id}
                            button
                            onClick={() => onSelect(_id)}
                        >
                            <ListItemText primary={name} />
                        </ListItem>
                    </List>
                ))}
            </Paper>
        </Grid>
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
                                {exercises.map(({ _id, name }) => (
                                    <ListItem
                                        key={_id}
                                        button
                                        onClick={() => onSelect(_id)}
                                    >
                                        <ListItemText primary={name} />
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
                    {name}
                </Typography>
                <img
                    src={images[0]}
                    display="block"
                    margin-left="200px"
                    margin-right="auto"
                    width="50%"
                    alt=""
                />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={style.Paper}>
                            <Typography variant="subtitle1">
                                {description}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={style.paper}>
                            Benefits:
                            {benefits.map((benefit) => (
                                <Typography variant="subtitle1">
                                    {benefit}
                                </Typography>
                            ))}
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={style.paper}>
                            <Typography variant="subtitle1">
                                Type of Exercise:
                                {type}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={style.paper}>
                            <Typography variant="subtitle1">
                                Muscles used:
                                {muscle}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={style.paper}>
                            <Typography variant="subtitle1">
                                Equipment:
                                {equipment}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={style.paper}>
                            <Typography variant="subtitle1">
                                Level:
                                {level}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={style.paper}>
                            <Typography variant="subtitle1">
                                Rating:
                                {rating}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    </Grid>
);

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
