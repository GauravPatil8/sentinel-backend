const express = require("express");
const { createPrintRequest } = require("../controller/PrintRequest");
const authMiddleware = require("../middlewares/auth"); // Protect API with authentication
const multer = require("multer");

const router = express.Router();

// Multer setup for file storage (stores in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API Route: Create Print Request
router.post("/", authMiddleware, upload.single("document"), createPrintRequest);

module.exports = router;
