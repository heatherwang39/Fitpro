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

const app = express();

// Middleware
app.use(logger("dev"));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(auth);

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

const port = process.env.PORT || 3333;

const httpsOptions = {
    key: fs.readFileSync("./keys/key.pem"),
    cert: fs.readFileSync("./keys/cert.pem"),
};

https.createServer(httpsOptions, app).listen(port, () => console.log(`Started on port ${port}`));
