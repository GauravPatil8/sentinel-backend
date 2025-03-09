require("dotenv").config();
const PrintRequest = require("../model/PrintRequest");
const ShopKeeper = require("../model/Shopkeeper");

// ✅ Create a Print Request (No Changes, Fixed `expiresAt`)
async function createPrintRequest(req, res) {
    try {
        // Extract data from request
        const { shopkeeperId, pages, copies, printMode } = req.body;
        const document = req.file; // Uploaded file

        // Validate required fields
        if (!shopkeeperId || !pages || !copies || !printMode || !document) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if the shopkeeper exists
        const shopkeeper = await ShopKeeper.findById(shopkeeperId);
        if (!shopkeeper) {
            return res.status(404).json({ message: "Shopkeeper not found" });
        }

        // Create a print request
        const printRequest = new PrintRequest({
            user: req.user.id, // Extracted from JWT token in authMiddleware
            shopkeeper: shopkeeperId,
            document: {
                data: document.buffer,
                contentType: document.mimetype
            },
            pages,
            copies,
            printMode,
            status: "Pending",
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // ✅ Auto-expire after 5 minutes
        });

        // Save to database
        await printRequest.save();

        return res.status(201).json({ message: "Print request created successfully", printRequest });
    } catch (error) {
        console.error("Error creating print request:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

// ✅ Get Print Requests for a Shopkeeper
async function getPrintRequestsByShop(req, res) {
    try {
        const shopkeeperId = req.params.shopid;

        // Check if shopkeeper ID is provided
        if (!shopkeeperId) {
            return res.status(400).json({ message: "Shopkeeper ID is required" });
        }

        // Find print requests for the given shopkeeper
        const printRequests = await PrintRequest.find({ shopkeeper: shopkeeperId });

        if (!printRequests.length) {
            return res.status(404).json({ message: "No print requests found for this shopkeeper" });
        }

        res.status(200).json(printRequests);
    } catch (error) {
        console.error("Error fetching print requests:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// ✅ Get Print Requests for a User
async function getPrintRequestsByUser(req, res) {
    try {
        const { userid } = req.params;
        const printRequests = await PrintRequest.find({ user: userid }).populate("shopkeeper", "shopName email");

        if (!printRequests.length) {
            return res.status(404).json({ message: "No print requests found for this user." });
        }

        res.status(200).json(printRequests);
    } catch (error) {
        console.error("Error fetching user print requests:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createPrintRequest, getPrintRequestsByShop, getPrintRequestsByUser };
