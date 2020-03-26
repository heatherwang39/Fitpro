const mongoose = require("mongoose");
const User = require("../models/user");

const dbUrl = process.env.DB_URL || "mongodb://localhost/fitpro";

mongoose.connect(dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true,
});

const db = mongoose.connection;

const NUM_TRAINERS = 30; // How many trainers to insert

/* eslint-disable */
const femaleFirstnames = ["Emma", "Olivia", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Abigail", "Emily", "Harper", "Amelia", "Evelyn", "Elizabeth", "Sofia", "Madison", "Avery", "Ella", "Scarlett", "Grace", "Chloe", "Victoria", "Riley", "Aria", "Lily", "Aubrey", "Zoey", "Penelope", "Lillian", "Addison", "Layla", "Natalie", "Camila", "Hannah", "Brooklyn", "Zoe", "Nora", "Leah", "Savannah", "Audrey", "Claire", "Eleanor", "Skylar", "Ellie", "Samantha", "Stella", "Paisley", "Violet", "Mila", "Allison", "Alexa", "Anna", "Hazel", "Aaliyah", "Ariana", "Lucy", "Caroline", "Sarah", "Genesis", "Kennedy", "Sadie", "Gabriella", "Madelyn", "Adeline", "Maya", "Autumn", "Aurora", "Piper", "Hailey", "Arianna", "Kaylee", "Ruby", "Serenity", "Eva", "Naomi", "Nevaeh", "Alice", "Luna", "Bella", "Quinn", "Lydia", "Peyton", "Melanie", "Kylie", "Aubree", "Mackenzie", "Kinsley", "Cora", "Julia", "Taylor", "Katherine", "Madeline", "Gianna", "Eliana", "Elena"];
const maleFirstnames = ["Noah", "Liam", "William", "Mason", "James", "Benjamin", "Jacob", "Michael", "Elijah", "Ethan", "Alexander", "Oliver", "Daniel", "Lucas", "Matthew", "Aiden", "Jackson", "Logan", "David", "Joseph", "Samuel", "Henry", "Owen", "Sebastian", "Gabriel", "Carter", "Jayden", "John", "Luke", "Anthony", "Isaac", "Dylan", "Wyatt", "Andrew", "Joshua", "Christopher", "Grayson", "Jack", "Julian", "Ryan", "Jaxon", "Levi", "Nathan", "Caleb", "Hunter", "Christian", "Isaiah", "Thomas", "Aaron", "Lincoln", "Charles", "Eli", "Landon", "Connor", "Josiah", "Jonathan", "Cameron", "Jeremiah", "Mateo", "Adrian", "Hudson", "Robert", "Nicholas", "Brayden", "Nolan", "Easton", "Jordan", "Colton", "Evan", "Angel", "Asher", "Dominic", "Austin", "Leo", "Adam", "Jace", "Jose", "Ian", "Cooper", "Gavin", "Carson", "Jaxson", "Theodore", "Jason", "Ezra", "Chase", "Parker", "Xavier", "Kevin", "Zachary", "Tyler", "Ayden", "Elias", "Bryson", "Leonardo"];
const lastnames = ["Allen", "Chung", "Chen", "Melton", "Hill", "Puckett", "Song", "Hamilton", "Bender", "Wagner", "McLaughlin", "McNamara", "Raynor", "Moon", "Woodard", "Desai", "Wallace", "Lawrence", "Griffin", "Dougherty", "Powers", "May", "Steele", "Teague", "Vick", "Gallagher", "Solomon", "Walsh", "Monroe", "Connolly", "Hawkins", "Middleton", "Goldstein", "Watts", "Johnston", "Weeks", "Wilkerson", "Barton", "Walton", "Hall", "Ross", "Chung", "Bender", "Woods", "Mangum", "Joseph", "Rosenthal", "Bowden", "Barton", "Underwood", "Jones", "Baker", "Merritt", "Cross", "Cooper", "Holmes", "Sharpe", "Morgan", "Hoyle", "Allen", "Rich", "Rich", "Grant", "Proctor", "Diaz", "Graham", "Watkins", "Hinton", "Marsh", "Hewitt", "Branch", "Walton", "O'Brien", "Case", "Watts", "Christensen", "Parks", "Hardin", "Lucas", "Eason", "Davidson", "Whitehead", "Rose", "Sparks", "Moore", "Pearson", "Rodgers", "Graves", "Scarborough", "Sutton", "Sinclair", "Bowman", "Olsen", "Love", "McLean", "Christian", "Lamb", "James", "Chandler", "Stout", "Cowan", "Golden", "Bowling", "Beasley", "Clapp", "Abrams", "Tilley", "Morse", "Boykin", "Sumner", "Cassidy", "Davidson", "Heath", "Blanchard", "McAllister", "McKenzie", "Byrne", "Schroeder", "Griffin", "Gross", "Perkins", "Robertson", "Palmer", "Brady", "Rowe", "Zhang", "Hodge", "Li", "Bowling", "Justice", "Glass", "Willis", "Hester", "Floyd", "Graves", "Fischer", "Norman", "Chan", "Hunt", "Byrd", "Lane", "Kaplan", "Heller", "May", "Jennings", "Hanna", "Locklear", "Holloway", "Jones", "Glover", "Vick", "O'Donnell", "Goldman", "McKenna", "Starr", "Stone", "McClure", "Watson", "Monroe", "Abbott", "Singer", "Hall", "Farrell", "Lucas", "Norman", "Atkins", "Monroe", "Robertson", "Sykes", "Reid", "Chandler", "Finch", "Hobbs", "Adkins", "Kinney", "Whitaker", "Alexander", "Conner", "Waters", "Becker", "Rollins", "Love", "Adkins", "Black", "Fox", "Hatcher", "Wu", "Lloyd", "Joyce", "Welch", "Matthews", "Chappell", "MacDonald", "Kane", "Butler", "Pickett", "Bowman", "Barton", "Kennedy", "Branch", "Thornton", "McNeill", "Weinstein", "Middleton", "Moss", "Lucas", "Rich", "Carlton", "Brady"];
/* eslint-enable */

const phoneDigit = () => ~~(Math.random() * 9);
const randomUser = () => {
    const user = {
        isTrainer: true,
        price: ~~(Math.random() * 50 + 20),
        lastname: lastnames[~~(lastnames.length * Math.random())],
        phone: `${phoneDigit()}${phoneDigit()}${phoneDigit()}`
        + `-${phoneDigit()}${phoneDigit()}${phoneDigit()}-${phoneDigit()}${phoneDigit()}${phoneDigit()}${phoneDigit()}`,
        rating: (Math.random() * 5).toFixed(1),
    };
    if (Math.random() < 0.5) {
        user.firstname = maleFirstnames[~~(Math.random() * maleFirstnames.length)];
        user.gender = "male";
        user.height = ~~(Math.random() * 7) + 70; // 6' - 6'6"
        user.weight = ~~(Math.random() * 60) + 200;
    } else {
        user.firstname = femaleFirstnames[~~(Math.random() * femaleFirstnames.length)];
        user.gender = "female";
        user.height = ~~(Math.random() * 8) + 65; // 5'5" - 6'
        user.weight = ~~(Math.random() * 50) + 150;
    }
    user.username = `${user.firstname}${user.lastname[0]}`.toLowerCase();
    user.email = `${user.username}@${Math.random() < 0.5 ? "hot" : "g"}mail.com`;
    user.password = user.username;
    return user;
};

let inserted = 0;
let errors = 0;

const finishedOne = (error) => {
    inserted++;
    if (error) errors++;
    if (inserted === NUM_TRAINERS) {
        console.log(`Created ${inserted - errors} trainers${errors ? ` (${errors} failed)` : ""}`);
        db.close();
    }
};

const createUser = async (u) => {
    try {
        await (new User(u)).save();
        finishedOne();
    } catch (e) {
        if (e.code === 11000) { // duplicate key error
            createUser(randomUser());
        } else {
            console.log(e);
            finishedOne(e);
        }
    }
};

[...Array(NUM_TRAINERS)].map(randomUser).forEach(createUser);
