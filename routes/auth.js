const express = require("express");


const { testSignup } = require("../controller/Customer");

const router = express.Router();

router.get("/", (req, res) => {
    res.end("Badmosh api");
});

router.get("/test", testSignup);

module.exports = router;