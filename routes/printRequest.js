const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/auth"); // Protect API with authentication
const { 
    createPrintRequest, 
    getPrintRequestsByShop, 
    getPrintRequestsByUser, 
    getShareableLink 
} = require("../controller/PrintRequest");

const router = express.Router();

// Multer setup for file handling (stores files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//  Main Route: Create Print Request with File Upload
router.post("/", authMiddleware, upload.array("files"), createPrintRequest);

//  Fetch all requests received by a shop
router.get("/shop/:shopid", authMiddleware, getPrintRequestsByShop);

//  Fetch all requests made by a user
router.get("/user/:userid", authMiddleware, getPrintRequestsByUser);

//  Generate a shareable link for a print request
router.get("/share/:requestId", authMiddleware, getShareableLink);

module.exports = router;
