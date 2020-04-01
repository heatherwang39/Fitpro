const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const https = require("https");
const cors = require("cors");

const auth = require("./auth");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const workoutsRouter = require("./routes/workouts");
const eventsRouter = require("./routes/events");
const trainersRouter = require("./routes/trainers");
const mailRouter = require("./routes/mail");

const app = express();
// Middleware
app.use(logger("dev"));
app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(auth);

app.use(express.static(path.join(__dirname, "../app/dist")));

// Database
const dbUrl = process.env.DB_URL || "mongodb://localhost/fitpro";
mongoose.connect(dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (e) => {
    console.log(e, "\nError connecting to database, exiting");
    process.exit();
});
db.on("open", () => console.log(`Connected to database at ${dbUrl}`));

// Routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/workouts", workoutsRouter);
app.use("/events", eventsRouter);
app.use("/trainers", trainersRouter);
app.use("/mail", mailRouter);

const port = process.env.PORT || 3333;

const httpsOptions = {
    key: fs.readFileSync("./keys/key.pem"),
    cert: fs.readFileSync("./keys/cert.pem"),
};

https.createServer(httpsOptions, app).listen(port, () => console.log(`Started on port ${port}`));
