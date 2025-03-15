// Libraries
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { createServer } = require("http"); 
const cors = require("cors");

// Custom files
const authRouter = require("./routes/auth");
const printRouter = require("./routes/printRequest");
const historyRouter = require("./routes/documentHistory");
const staticRouter = require("./routes/staticRouter");
const { initializeSocket } = require("./services/socketServices");
const connectToMongo = require("./connect");

// Set-up
const app = express();
const PORT = 5000;
const server = createServer(app);

// mongodb connection
connectToMongo(process.env.MONGO_URI).then(console.log("mongoDB connected"));

app.use(cors({
    origin: "*",
    methods: ["POST", "GET"]
}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

// file middleware (sort of)
app.use("/", staticRouter);
app.use("/api/auth", authRouter);
app.use("/api/print-requests", printRouter);
app.use("/api/document-history", historyRouter);

initializeSocket(server);

server.listen(PORT, () => console.log(`Server started at port: http://localhost:${PORT}/`));