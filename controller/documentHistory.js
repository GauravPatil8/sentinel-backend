const PrintRequest = require("../model/PrintRequest");

async function getDocumentHistory(req, res) {
    try {
        const userId = req.params.userid;

        // Check if user ID is provided
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find all print requests made by the user
        const history = await PrintRequest.find({ user: userId });

        if (!history.length) {
            return res.status(404).json({ message: "No document history found" });
        }

        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching document history:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getShopkeeperDocumentHistory(req, res) {
    try {
        const shopId = req.params.shopid;

        // Check if shop ID is provided
        if (!shopId) {
            return res.status(400).json({ message: "Shop ID is required" });
        }

        // Find all print requests assigned to this shopkeeper
        const history = await PrintRequest.find({ shopkeeper: shopId });

        if (!history.length) {
            return res.status(404).json({ message: "No document history found for this shopkeeper" });
        }

        res.status(200).json(history);
    } catch (error) {
        console.error("Error fetching document history:", error);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = { getDocumentHistory, getShopkeeperDocumentHistory };
