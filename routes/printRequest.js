const express = require("express");
const { createPrintRequest, getPrintRequestsByShop, getPrintRequestsByUser, getShareableLink, setShopkeeperKey, setEncryptedKey } = require("../controller/PrintRequest");
const authMiddleware = require("../middlewares/auth"); // Protect API with authentication
// const multer = require("multer");

const router = express.Router();

// Multer setup for file storage (stores in memory as Buffer)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// API Route: Create Print Request
router.post("/", authMiddleware, createPrintRequest);

//Sets the shopkeeper's public key
router.post("/shopkeeper/set-public-key", authMiddleware, setShopkeeperKey);

//Sets the aes key of the file (encrypted by customer using shopkeepers public key)
router.post("/customer/encrypted-key", authMiddleware, setEncryptedKey);

//Fetches all request that the shop has recieved
router.get("/shop/:shopid", authMiddleware, getPrintRequestsByShop);

//Fetches all request that the shop has recieved
router.get("/user/:userid", authMiddleware, getPrintRequestsByUser);

//Generated the shareable link
router.get("/share/:requestId", authMiddleware, getShareableLink);

module.exports = router;
