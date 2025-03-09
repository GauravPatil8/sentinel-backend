// Libraries
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

// Custom files
const authRouter = require("./routes/auth");
const printRouter = require("./routes/printRequest");
const historyRouter = require("./routes/documentHistory");
const connectToMongo = require("./connect");

// Code
const app = express();
const PORT = 5000;

// mongodb connection
connectToMongo(process.env.MONGO_URI).then(console.log("mongoDB connected"));


// middleware (sort of)
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/print-requests", printRouter);
app.use("/api/document-history", historyRouter);


app.get("/",(req, res) => {
    res.end("Home pe hai na tu??");
})

app.listen(PORT, () => console.log(`Server started at port: http://localhost:${PORT}/`));