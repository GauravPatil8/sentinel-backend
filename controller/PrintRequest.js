require("dotenv").config();
const PrintRequest = require("../model/PrintRequest");


async function createPrintRequest(req, res) {
    try{
        const { customerId, shopkeeperId, encryptedData, fileNames, pages, copies } = req.body;

        if (!customerId || !encryptedData || !pages || !copies || !fileNames) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        const printRequest = new PrintRequest({
            customer:customerId,
            shopkeeper: shopkeeperId || null, 
            encryptedData,
            fileNames,
            pages,
            copies,
            status: "Pending",
            expiresAt
        });
        await printRequest.save();
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

async function getShareableLink(req, res){
    try{
        const { requestId } = req.params;
        const printRequest = await PrintRequest.findById(requestId);

        if(!printRequest) {
            return res.status(400).json({Error: "Print request not found"});
        };


        printRequest.expiresAt = new Date();
        printRequest.expiresAt.setMinutes(printRequest.expiresAt.getMinutes() + 5);

        await printRequest.save();

        const shareLink = `${req.protocol}://${req.get("host")}/share/${requestId}`;

        res.json({ success: true, shareLink });
    } catch(err){
        console.error("Error generating print link:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

async function setShopkeeperKey(req, res){
    try {
        const { requestId, publicKey } = req.body;

        if (!requestId || !publicKey) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        
        const printRequest = await PrintRequest.findById(requestId);
        if (!printRequest) {
            return res.status(404).json({ message: "Print request not found" });
        }

        printRequest.shopPublicKey = publicKey;
        await printRequest.save();

        res.status(200).json({ message: "Shopkeeper public key stored successfully" });
    } catch (error) {
        console.error("Error storing public key:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

async function setEncryptedKey(req, res){
    try{
        const { requestId, encryptedKey } = req.body();

        const printRequest = await PrintRequest.findById(requestId);

        if(!printRequest){
            return res.status(404).json({message: "Request Not Found"});
        }

        printRequest.encryptedKey = encryptedKey;
        await printRequest.save()

        res.status(200).json({message: "Key recieved"});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};
module.exports = { 
    createPrintRequest, 
    getPrintRequestsByShop, 
    getPrintRequestsByUser, 
    getShareableLink,
    setShopkeeperKey,
    setEncryptedKey 
};
