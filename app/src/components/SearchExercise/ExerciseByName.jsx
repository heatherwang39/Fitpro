import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Grid, Paper, Typography } from "@material-ui/core";
import axios from "axios";
// import TrainerDetail from './TrainerDetail';
// import API from "../../api/api";

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

class ExerciseByName extends Component {

    state={
        paramData: [],
    }

    componentDidMount() {
        const { params } = this.props.match;
        if (params) {
            axios.get(`http://localhost:3333/exercises/?name=${params.name}`).then((res) => {
                this.setState({ paramData: res.data });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    render() {
        const { paramData } = this.state;
        const exercise = paramData[0];
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper style={style.Paper}>
                        <Typography variant="h2">
                            {exercise.name}
                        </Typography>
                        <img
                            src={exercise.images[0]}
                            display="block"
                            margin-left="200px"
                            margin-right="auto"
                            width="50%"
                            alt=""
                        />
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper style={style.Paper}>
                                    <Typography variant="subtitle1">
                                        {exercise.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper style={style.paper}>
                                    Benefits:
                                    {exercise.benefits.map((benefit) => (
                                        <Typography variant="subtitle1">
                                            {benefit}
                                        </Typography>
                                    ))}
                                </Paper>
                            </Grid>
                            <Grid item xs={3}>
                                <Paper style={style.paper}>
                                    <Typography variant="subtitle1">
                                        Type of Exercise:
                                        {exercise.type}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={3}>
                                <Paper style={style.paper}>
                                    <Typography variant="subtitle1">
                                        Muscles used:
                                        {exercise.muscle}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={3}>
                                <Paper style={style.paper}>
                                    <Typography variant="subtitle1">
                                        Equipment:
                                        {exercise.equipment}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={3}>
                                <Paper style={style.paper}>
                                    <Typography variant="subtitle1">
                                        Level:
                                        {exercise.level}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={3}>
                                <Paper style={style.paper}>
                                    <Typography variant="subtitle1">
                                        Rating:
                                        {exercise.rating}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default connect(null, { ExerciseByName })(ExerciseByName);
