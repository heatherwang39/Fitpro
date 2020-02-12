import path from "path";

import express from "express";
import bodyParser from "body-parser";

import { testRoute } from "./test";

const port = process.env.PORT || 4321;
const app = express();

app.use(
    bodyParser.urlencoded({ extended: true }),
    bodyParser.json(),
);

app.listen(port, console.info("Server running, listening on port ", port));

testRoute(app);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../../dist")));
    app.get("/*", (_, res) => {
        res.sendFile(path.resolve("index.html"));
    });
}
