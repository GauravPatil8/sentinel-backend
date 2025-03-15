const mongoose = require("mongoose");

const PrintRequestSchema = new mongoose.Schema({
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer" 
    },
    shopkeeperId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopKeeper",
        default: null
    }, 
    encryptedFiles: [{  
        data: { 
            type: Buffer, 
            required: true 
        }
    }],
    fileNames: {
        type: [String],
        required: true
    },
    pages: {
        type: String,
        required: true
    },
    copies: {
        type: Number,
        required: true
    },
    status: { 
        type: String, 
        enum: ["Pending", "Printed"],
        default: "Pending" 
    },
    expiresAt: { 
        type: Date, // Auto-delete after expiry
        required: true 
    }
}, { timestamps: true });

const PrintRequest = mongoose.model("PrintRequest", PrintRequestSchema);
module.exports = PrintRequest;
