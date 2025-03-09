const mongoose = require("mongoose");

const PrintRequestSchema = new mongoose.Schema({
        user: { 
            type:mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        },
        shopkeeper: { 
            type: mongoose.Schema.Types.ObjectId, // changed this for print - request api
            ref: "User" 
        }, 
        shareToken: String, //Optional (jab link share karenge, tab hoga use)
        document: {
            data: Buffer, 
            contentType: String
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
            enum: ["Color", "B&W"] 
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
        expiresAt: Date // For shareToken expiration
    },
    {timestamps: true}
);

const PrintRequest = mongoose.model("PrintRequest", PrintRequestSchema);

module.exports = PrintRequest;