require("dotenv").config();
const PrintRequest = require("../model/PrintRequest");
const CryptoJS = require("crypto-js");

// Function to generate AES Key & IV
function generateAESKeyIV() {
    return {
        key: CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64), // 256-bit key
        iv: CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64)   // 128-bit IV
    };
}

// Function to encrypt file data
function encryptFileData(fileBuffer, key, iv) {
    const base64File = Buffer.from(fileBuffer).toString("base64"); // Convert buffer to Base64
    const encrypted = CryptoJS.AES.encrypt(base64File, CryptoJS.enc.Base64.parse(key), { 
        iv: CryptoJS.enc.Base64.parse(iv), 
        mode: CryptoJS.mode.CBC 
    });

    return encrypted.toString();
}

// Create a print request with encrypted files
async function createPrintRequest(req, res) {
    try {
        console.log("🔹 Received Request Data:", req.body); // Debugging

        const { customerId, shopkeeperId, filesInfo } = req.body;

        if (!customerId || !filesInfo || filesInfo.length === 0) {
            console.error("❌ Missing required fields");
            return res.status(400).json({ message: "Missing required fields" });
        }

        // ✅ Generate AES Key and IV (but DO NOT store in DB)
        const { key, iv } = generateAESKeyIV();

        // ✅ Encrypt files
        const encryptedFiles = filesInfo.map(file => ({
            id: file.id,
            fileName: file.name,
            encryptedData: encryptFileData(file.data, key, iv), // Encrypt file data
            pages: file.pages,
            size: file.size,
            copies: file.copies
        }));

        // ✅ Set expiration time (5 minutes)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        // ✅ Save only encrypted files, not the key
        const printRequest = await PrintRequest.create({
            customerId,
            shopkeeperId: shopkeeperId || null,
            encryptedFiles,
            status: "Pending",
            expiresAt
        });

        console.log("✅ Print request created:", printRequest);

        // ✅ Send AES key & IV in the API response, but don't store them
        res.status(201).json({
            message: "Print request created",
            requestId: printRequest._id,
            aesKey: key,  // ⬅️ Send key in response
            aesIV: iv     // ⬅️ Send IV in response
        });

    } catch (err) {
        console.error("🔥 Server Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


// Get print requests for a shopkeeper
async function getPrintRequestsByShop(req, res) {
    try {
        const shopkeeperId = req.params.shopid;
        if (!shopkeeperId) {
            return res.status(400).json({ message: "Shopkeeper ID is required" });
        }

        const printRequests = await PrintRequest.find({ shopkeeperId });

        if (!printRequests.length) {
            return res.status(404).json({ message: "No print requests found for this shopkeeper" });
        }

        res.status(200).json(printRequests);
    } catch (error) {
        console.error("Error fetching print requests:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Get print requests for a user
async function getPrintRequestsByUser(req, res) {
    try {
        const { userid } = req.params;
        console.log("Fetching print requests for user:", userid);

        const printRequests = await PrintRequest.find({ customerId: userid })
            .select("encryptedFiles.fileName status createdAt copies");

        console.log("Print Requests Found:", printRequests);

        if (!printRequests.length) {
            return res.status(404).json({ message: "No print requests found for this user." });
        }

        res.status(200).json({ printRequests });
    } catch (error) {
        console.error("Error fetching user print requests:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// Generate a shareable link
async function getShareableLink(req, res) {
    try {
        const { requestId } = req.params;
        const printRequest = await PrintRequest.findById(requestId);

        if (!printRequest) {
            return res.status(400).json({ message: "Print request not found" });
        }

        printRequest.expiresAt = new Date();
        printRequest.expiresAt.setMinutes(printRequest.expiresAt.getMinutes() + 5);
        await printRequest.save();

        const shareLink = `${req.protocol}://${req.get("host")}/share/${requestId}`;

        res.json({ success: true, shareLink });
    } catch (err) {
        console.error("Error generating print link:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { 
    createPrintRequest, 
    getPrintRequestsByShop, 
    getPrintRequestsByUser, 
    getShareableLink
};
