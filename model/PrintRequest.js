const mongoose = require("mongoose");

const PrintRequestSchema = new mongoose.Schema({
        user: { 
            type: ObjectId, 
            ref: "User" 
        },
        shopkeeper: { 
            type: ObjectId, 
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
        createdAt: Date,
        expiresAt: Date // For shareToken expiration
    },
    {timestamps: true}
);

const PrintRequest = mongoose.model("PrintRequest", PrintRequestSchema);

module.exports = PrintRequest;