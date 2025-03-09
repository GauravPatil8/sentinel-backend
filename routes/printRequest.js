const express = require("express");
const { createPrintRequest, getPrintRequestsByShop, getPrintRequestsByUser } = require("../controller/PrintRequest");
const authMiddleware = require("../middlewares/auth"); // Protect API with authentication
const multer = require("multer");

const router = express.Router();

// Multer setup for file storage (stores in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API Route: Create Print Request
router.post("/", authMiddleware, upload.single("document"), createPrintRequest);
router.get("/shop/:shopid", authMiddleware, getPrintRequestsByShop);
router.get("/user/:userid", authMiddleware, getPrintRequestsByUser);
module.exports = router;
