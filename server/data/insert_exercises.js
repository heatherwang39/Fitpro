const mongoose = require("mongoose");
const fs = require("fs");
const readlineSync = require("readline-sync");
const { spawn } = require("child_process");

const Exercise = require("../models/exercise");

const dbUrl = process.env.DB_URL || "mongodb://localhost/fitpro";
// const dbUrl = "mongodb+srv://user:Fitpro123@cluster0-8pqsv.mongodb.net/test?retryWrites=true&w=majority";
let jsonExists = fs.existsSync("bbcom_exercises.json");
let dbConnected = false;

mongoose.connect(dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true,
});

const db = mongoose.connection;

const insertExercises = () => {
    if (!jsonExists || !dbConnected) return;
    console.log("Loading exercises...");
    const exercises = JSON.parse(fs.readFileSync("bbcom_exercises.json"));
    console.log(`Inserting ${exercises.length} exercises...`);
    Exercise.insertMany(exercises, () => {
        const rmExercises = readlineSync.question("Done inserting. Delete json? [y/N]");
        if (rmExercises.toLowerCase().includes("y")) {
            try {
                fs.unlinkSync("bbcom_exercises.json");
                fs.unlinkSync("bbcom_urls.txt");
            } catch (error) {
                console.log(`Failed to delete: (${error.toString()})`);
            }
        }
        db.close();
    });
};

if (!fs.existsSync("bbcom_exercises.json")) {
    const getExercises = readlineSync.question("Exercises database doesn't exist. Download now? [Y/n]");
    if (getExercises.toLowerCase().includes("n")) {
        process.exit();
    }
    console.log("");
    const download = spawn("python3", ["./bbcom.py"], { cwd: process.cwd(), stdio: "inherit" });
    download.on("exit", (code) => {
        if (code) {
            console.log(`Download failed (exit code ${code.toString()})`);
            process.exit();
        }
        if (!fs.existsSync("bbcom_exercises.json")) {
            console.log("Error getting exercises, not inserting");
            process.exit();
        }
        jsonExists = true;
        insertExercises();
    });
}

db.on("error", (e) => {
    console.log(e, "\nError connecting to database, exiting");
    process.exit();
});

db.on("open", () => {
    dbConnected = true;
    insertExercises();
});
