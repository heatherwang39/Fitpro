function WorkoutExercise(exercise, params) {
    this.exercise = exercise;
    this.params = params;
}

export const workoutExerciseList = (exercises, params) => exercises.map(
    (x, i) => new WorkoutExercise(x, params.length > i ? params[i] : {}),
);

/*
 * A single workout consisting of exercises and their parameters
 */
export class Workout {
    constructor(id, name, ownerUserId, workoutExercises) {
        this.id = id;
        this.name = name;
        this.ownerUserId = ownerUserId;
        this.workoutExercises = workoutExercises;
    }
}

export default Workout;
