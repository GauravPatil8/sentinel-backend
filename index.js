// Libraries
const express = require("express");
const mongoose = require("mongoose");

// Custom files
const authRouter = require("./routes/auth");
const printRouter = require("./routes/printRequest");
const historyRouter = require("./routes/documentHistory");
const connectToMongo = require("./connect");

// Code
const app = express();
const PORT = 5000;

// mongodb connection
connectToMongo("mongodb://127.0.0.1:27017/sentinel").then(console.log("mongoDB connected"));


// middleware (sort of)
app.use("/api/auth", authRouter);
app.use("/api/print-request", printRouter);
app.use("/api/document-history", historyRouter);


app.get("/",(req, res) => {
    res.end("Home pe hai na tu??");
})

app.listen(PORT, () => console.log(`Server started at port: http://localhost:${PORT}/`));