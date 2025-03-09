require("dotenv").config();
const PrintRequest = require("../model/PrintRequest");
const ShopKeeper = require("../model/Shopkeeper");

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
            expiresAt: { type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000) } // auto expire after 5 mins
        });

        // Save to database
        await printRequest.save();

        return res.status(201).json({ message: "Print request created successfully", printRequest });
    } catch (error) {
        console.error("Error creating print request:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createPrintRequest };
