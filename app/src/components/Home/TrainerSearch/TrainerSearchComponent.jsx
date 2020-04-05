import React from "react";
import { PropTypes } from "prop-types";
import { useForm } from "react-hook-form";
import {
    useHistory,
} from "react-router-dom";
import styles from "./TrainerSearchComponent.module.css";

const TrainerSearchComponent = (props) => {
    const { isAuth } = props;
    const containerClass = [styles.container];
    !isAuth && containerClass.push(styles.expanded);

    const { handleSubmit, register } = useForm();
    const onSubmit = (values) => {
        console.log(values);
    };
    const history = useHistory();
    return (
        <div className={containerClass.join(" ")}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
                <button onClick={ () => history.push({
                        pathname: "/trainers",
                    })
                }>Find a Trainer</button>
                <button onClick={ () => history.push({
                        pathname: "/exercises",
                    })
                }>Find exercises</button>
                <button onClick={ () => history.push({
                        pathname: "/workouts",
                    })
                }>Create workouts</button>
            </form>
        </div>
    );
};

TrainerSearchComponent.propTypes = {
    isAuth: PropTypes.bool.isRequired,
};

export default TrainerSearchComponent;
