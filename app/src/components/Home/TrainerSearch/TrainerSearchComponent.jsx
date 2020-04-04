import React from "react";
import { PropTypes } from "prop-types";
import { useForm } from "react-hook-form";
import styles from "./TrainerSearchComponent.module.css";

const TrainerSearchComponent = (props) => {
    const { isAuth } = props;
    const containerClass = [styles.container];
    !isAuth && containerClass.push(styles.expanded);

    const { handleSubmit, register } = useForm();
    const onSubmit = (values) => {
        console.log(values);
    };
    return (
        <div className={containerClass.join(" ")}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
                <h1>
                    Find a Trainer
                </h1>
                <span>
                    WHERE
                </span>
                <input
                    name="location"
                    ref={register({})}
                />
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

TrainerSearchComponent.propTypes = {
    isAuth: PropTypes.bool.isRequired,
};

export default TrainerSearchComponent;
