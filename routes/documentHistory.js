const express = require("express");
const { getDocumentHistory, getShopkeeperDocumentHistory } = require("../controller/documentHistory");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.get("/", (req, res) => {
    res.end("history");
});
router.get("/:userid", authMiddleware, getDocumentHistory);
router.get("/shop/:shopid", authMiddleware, getShopkeeperDocumentHistory);
module.exports = router;