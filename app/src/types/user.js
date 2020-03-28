export class User {
    constructor({
        id, username, firstname, lastname, email, phone, location, height,
        weight, isTrainer, isAdmin, goalType, rating, trainers, clients, gender,
        price, imgsrc,
    }) {
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
        this.trainers = trainers || [];
        this.clients = clients || [];
        this.gender = gender;
        this.price = price;
        this.imgsrc = imgsrc;
    }
}
export default User;
