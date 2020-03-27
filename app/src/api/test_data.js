/* eslint-disable max-len */
import { User } from "../types/user";
import { Exercise } from "../types/exercise";
import { workoutExerciseList, Workout } from "../types/workout";

export const clientUser = new User(1, "user", "George", "Attwel", "client@mail.com",
    "555-555-1234", "Toronto", "6'0", "200lb", false, false, "goalType", 2.5, [2], [], "male", 20, "");
export const trainerUser = new User(2, "user2", "TrainerFirst", "TrainerLast", "trainer@mail.com",
    "555-123-4567", "Toronto", "6'3", "220lb", true, false, "goalType", 4, [], [1, 3, 4, 5], "male", 30, "");
export const client2User = new User(3, "user3", "Client2First", "Client2Last", "client2@mail.com",
    "555-555-4321", "Toronto", "6'1", "190lb", false, false, "goalType", 3.5, [2], [], "male", 30, "");
export const client3User = new User(4, "user4", "Client4First", "Client4Last", "client4@mail.com",
    "555-555-4321", "Toronto", "6'1", "190lb", false, false, "goalType", 3.5, [2], [], "male", 30, "");

export const client4User = new User(5, "user5", "Client5First", "Client5Last", "client5@mail.com",
    "555-555-4321", "Toronto", "6'1", "190lb", false, false, "goalType", 3.5, [2], [], "male", 30, "");

export const trainerUser1 = new User(11, "user11", "Jamie", "Doe", "trainer11@mail.com",
    "555-123-4544", "Toronto", "6'3", "230lb", true, false, "goalType", 4.5, [], [], "male", 20, "TrainerAvatar1.png");
export const trainerUser2 = new User(12, "user12", "Mika", "Lahey", "trainer12@mail.com",
    "555-123-4555", "Toronto", "6'2", "220lb", true, false, "goalType", 4.0, [], [], "male", 25, "TrainerAvatar2.png");
export const trainerUser3 = new User(13, "user13", "Andy", "Richards", "trainer13@mail.com",
    "555-123-4566", "Toronto", "6'1", "210lb", true, false, "goalType", 3.5, [], [], "male", 35, "TrainerAvatar3.png");
export const trainerUser4 = new User(14, "user14", "Ivy", "Persson", "trainer14@mail.com",
    "555-123-4577", "Toronto", "6'0", "200lb", true, false, "goalType", 3.0, [], [], "female", 30, "TrainerAvatar4.png");

export const exercise1 = new Exercise(21, "Barbell Bench Press", "Chest, Shoulders, Triceps",
    "Bench, Barbell", "Lie face up on a flat bench, and grip a barbell with the hands slightly wider than shoulder-width. Press the feet into the ground and the hips into the bench while lifting the bar off the rack. Slowly lower the bar to the chest by allowing the elbows to bend out to the side. Stop when the elbows are just below the bench, and press feet into the floor to press the weight straight up to return to the starting position.",
    "Intermediate", "push");
export const exercise2 = new Exercise(22, "Barbell Squat", "Quad, Hamstring, Glute, Calves, Lower Back", "Barbell",
    "Place a barbell in a rack just below shoulder-height. Dip under the bar to put it behind the neck across the top of the back, and grip the bar with the hands wider than shoulder-width apart. Lift the chest up and squeeze the shoulder blades together to keep the straight back throughout the entire movement. Stand up to bring the bar off the rack and step backwards, then place the feet so that they are a little wider than shoulder-width apart. Sit back into hips and keep the back straight and the chest up, squatting down so the hips are below the knees. From the bottom of the squat, press feet into the ground and push hips forward to return to the top of the standing position.",
    "Advanced", "Push");
export const exercise3 = new Exercise(23, "Barbell Bent Over Row", "Arms, Back, Shoulders", "Barbell",
    "Grip a barbell with palms down so that the wrists, elbows, and shoulders are in a straight line. Lift the bar from the rack, bend forward at the hips, and keep the back straight with a slight bend in the knees. Lower the bar towards the floor until the elbows are completely straight, and keep the back flat as the bar is pulled towards the belly button. Then slowly lower the bar to the starting position and repeat.",
    "Advanced", "Pull");
export const exercise4 = new Exercise(24, "Barbell Deadlift", "Full Body", "Barbell",
    "Stand behind the barbell with the feet about shoulder-width apart, the toes slightly rotated out, and the shins almost touching the bar. Sit back into the hips slightly while keeping a straight back so that the chest is lifted upward, and bend forward to grip the bar in an over-under grip with one palm facing up and the other facing down. Squeeze the bar in the hands and sink back onto the hips while pressing the feet into the floor. Keeping the back flat, push the hips forward to move to standing position. Finish standing in a tall position with the shoulders pulled back and the legs straight. Return to the starting position by shifting the weight back into the hips and keep the back straight while allowing the knees to bend. When this movement is done properly, the glutes and the back of the thighs should feel the work, NOT the back.",
    "Advanced", "Pull");


export const testWorkout = new Workout(11, "Test Workout", 1, [{ exercise: exercise2, params: { name: "reps", value: 10 } }]);
export const testWorkout2 = new Workout(12, "Other Test Workout", 1, [{ exercise: exercise2, params: { name: "reps", value: 10 } }]);
export const testWorkout3 = new Workout(13, "Some Workout", 1, [{ exercise: exercise2, params: { name: "reps", value: 10 } }]);
export const allWorkouts = [testWorkout, testWorkout2, testWorkout3];


export const testReviews = [
    { name: "Cory Trevor", rating: 5, review: "Great trainer and very nice person!" },
    { name: "Piston Honda", rating: 1, review: "Not knowledgable about fitness and took a long time to reply >:(" },
    { name: "Randy Lahey", rating: 4, review: "Sometimes late but otherwise good" },
];

export const testOffers = [
    { title: "Weekly Workout", details: "Workout once per week", price: "$30/week" },
    { title: "Monthly Special", details: "Workout 3 times/week + on-demand diet advice via FitPro.", price: "$200/month" },
    { title: "Full Year", details: "Monthly Special for an entire year", price: "$2000/year" },
];

export const allUsers = [
    clientUser,
    client2User,
    client3User,
    client4User,
    trainerUser,
    trainerUser1,
    trainerUser2,
    trainerUser3,
    trainerUser4];
