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
    let exercises;
    try {
        exercises = JSON.parse(fs.readFileSync("bbcom_exercises.json"));
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
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

const downloadExercises = () => {
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
};

if (!fs.existsSync("bbcom_exercises.json")) {
    const getExercises = readlineSync.question("Exercises database doesn't exist. Download now? [Y/n] ");
    if (getExercises.toLowerCase().includes("n")) {
        process.exit();
    }
    console.log("");
    const requirements = spawn("python3", ["-m", "pip", "install", "-r", "requirements.txt"]);
    requirements.on("exit", (code) => {
        if (!code) {
            downloadExercises();
            return;
        }
        const retry = readlineSync.question("Failed to install requirements for fetching data. Try again with sudo? [Y/n] ");
        if (retry.toLowerCase().includes("n")) {
            process.exit();
        }
        const sudoRequirements = spawn("sudo", ["python3", "-m", "pip", "install", "-r", "requirements.txt"]);
        sudoRequirements.on("exit", (retryCode) => {
            if (retryCode) {
                console.log("Failed to install requirements with sudo. Try manually installing requirements.txt or using a virtual environment");
                process.exit(1);
            }
            downloadExercises();
        });
    });
}

db.on("error", (e) => {
    console.log(e, "\nError connecting to database, exiting");
    process.exit(1);
});

db.on("open", () => {
    dbConnected = true;
    insertExercises();
});
