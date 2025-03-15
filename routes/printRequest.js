const express = require("express");
const { createPrintRequest, getPrintRequestsByShop, getPrintRequestsByUser, getShareableLink} = require("../controller/PrintRequest");
const authMiddleware = require("../middlewares/auth"); // Protect API with authentication

const router = express.Router();

// API Route: Create Print Request
router.post("/", authMiddleware, createPrintRequest);

//Fetches all request that the shop has recieved
router.get("/shop/:shopid", authMiddleware, getPrintRequestsByShop);

//Fetches all request that the shop has recieved
router.get("/user/:userid", authMiddleware, getPrintRequestsByUser);

//Generated the shareable link
router.get("/share/:requestId", authMiddleware, getShareableLink);

module.exports = router;
