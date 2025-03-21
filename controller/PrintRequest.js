require("dotenv").config();
const PrintRequest = require("../model/PrintRequest");


async function createPrintRequest(req, res) {
    try{
        const { customerId, shopkeeperId, filesInfo, encryptedData ,pages } = req.body;

        if (!customerId || !filesInfo || !pages ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        const printRequest = await PrintRequest.create({
            customerId:customerId,
            shopkeeperId: shopkeeperId || null, 
            filesInfo,
            encryptedData,
            pages,
            status: "Pending",
            expiresAt
        });
        res.status(201).json({ message: "Print request created", requestId: printRequest._id});
    } catch(err){
        console.error("Error: ", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Get Print Requests for a Shopkeeper
async function getPrintRequestsByShop(req, res) {
    try {
        const shopkeeperId = req.params.shopid;

        
        if (!shopkeeperId) {
            return res.status(400).json({ message: "Shopkeeper ID is required" });
        }

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

async function getPrintRequestsByUser(req, res) {
    try {
        const { userid } = req.params;
        const printRequests = await PrintRequest.find({ customerId: userid }).populate("shopkeeperId", "shopName email");

        if (!printRequests.length) {
            return res.status(404).json({ message: "No print requests found for this user." });
        }

        res.status(200).json(printRequests);
    } catch (error) {
        console.error("Error fetching user print requests:", error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getShareableLink(req, res){
    try{
        console.log("request recieved")
        const { requestId } = req.params;
        const printRequest = await PrintRequest.findById(requestId);

        if(!printRequest) {
            return res.status(400).json({Error: "Print request not found"});
        };


        printRequest.expiresAt = new Date();
        printRequest.expiresAt.setMinutes(printRequest.expiresAt.getMinutes() + 5);

        await printRequest.save();

        const shareLink = `${req.get("origin")}/share/${requestId}`;

        res.json({ success: true, shareLink });
    } catch(err){
        console.error("Error generating print link:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { 
    createPrintRequest, 
    getPrintRequestsByShop, 
    getPrintRequestsByUser, 
    getShareableLink,
};
