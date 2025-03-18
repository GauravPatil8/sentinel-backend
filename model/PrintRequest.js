const mongoose = require("mongoose");

const PrintRequestSchema = new mongoose.Schema({
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer",
        required: true
    },
    shopkeeperId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopKeeper",
        default: null
    }, 
    encryptedFiles: [{  
        id: { type: Number, required: true },  
        fileName: { type: String, required: true },
        encryptedData: { type: String, required: true },
        pages: { type: Number, required: true }, 
        size: { type: String, required: true }, 
        copies: { type: Number, required: true } 
    }],
    filesInfo: [
        {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          pages: { type: Number, required: true },
          size: { type: String, required: true },
          copies: { type: Number, required: true }
        },
    ],
    aesKey: {   //  Store AES key for decryption
        type: String,
        required: true
    },
    aesIV: {    //  Store IV for decryption
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ["Pending", "Approved", "Printed"],
        default: "Pending" 
    },
    expiresAt: { 
        type: Date, // Auto-delete after expiry
        required: true 
    }
}, { timestamps: true });

const PrintRequest = mongoose.model("PrintRequest", PrintRequestSchema);
module.exports = PrintRequest;
