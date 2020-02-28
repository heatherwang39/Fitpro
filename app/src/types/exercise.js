export class Exercise {
    constructor(id, exerciseName, muscleGroup, equipment, instruction, exerciseLevel, forceType) {
        this.id = id;
        this.exerciseName = exerciseName;
        this.muscleGroup = muscleGroup;
        this.equipment = equipment;
        this.instruction = instruction;
        this.exerciseLevel = exerciseLevel;
        this.forceType = forceType;
    }
}

Exercise.fromJSON = (obj) => new Exercise(obj.id, obj.exerciseName, obj.muscleGroup,
    obj.equipment, obj.instruction, obj.exerciseLevel, obj.forceType);

export default Exercise;