const mongoose = require("mongoose");

const PrintRequestSchema = new mongoose.Schema({
    Customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer" 
    },
    shopkeeper: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopKeeper",
        default: null
    }, 
    encryptedData: { 
        type: Buffer, 
        required: true
    },
    fileNames: {
        type: [String],
        required: true
    },
    initialVector: { 
        type: String, // iv: inital vector
        required: true
    },
    encryptedKey: { 
        type: String,
    },
    shopPublicKey: { 
        type: String, //null until they access link
        default: null
    },
    pages: {
        type: String,
        required: true
    },
    copies: {
        type: Number,
        required: true
    },
    printMode: { 
        type: String, 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Printed"],
        default: "Pending" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    expiresAt: { 
        type: Date, // Auto-delete after expiry
        required: true 
    }
}, { timestamps: true });

const PrintRequest = mongoose.model("PrintRequest", PrintRequestSchema);
module.exports = PrintRequest;
