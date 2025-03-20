const express = require("express");
const {getPrintDetails, getNearByShops}  = require("../controller/StaticRouter");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.get("/api/share/:requestId", getPrintDetails);
router.get("/api/nearby-shops", authMiddleware, getNearByShops);

router.get("/",(req, res) => {
    res.end("Home");
});

router.get("/test", (req, res) => {
    res.render("index");
});

module.exports = router;