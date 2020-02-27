export class User {
    constructor(id, username, firstname, lastname, email, phone, location, height,
        weight, isTrainer, isAdmin, goalType, rating, trainers) {
        this.id = id;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.isTrainer = isTrainer;
        this.email = email;
        this.phone = phone;
        this.height = height;
        this.weight = weight;
        this.isAdmin = isAdmin;
        this.goalType = goalType;
        this.rating = rating;
        this.location = location;
        this.trainers = trainers;
    }
}

User.fromJSON = (obj) => new User(obj.id, obj.username, obj.firstname,
    obj.lastname, obj.email, obj.phone, obj.location, obj.height, obj.weight,
    obj.isTrainer, obj.isAdmin, obj.goalType, obj.rating, obj.trainers);

export default User;
