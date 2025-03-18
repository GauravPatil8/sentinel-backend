const mongoose = require("mongoose");

const ShopKeeperSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        shopName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            default: null
        },
        services: {
            type: [String]
        },
        location: {
            type: {
                type: String, 
                enum: ["Point"], 
                required: true
            },
            coordinates: {
                type: [Number], 
                required: true
            }
        }
    },
    {timestamps: true},
);

ShopKeeperSchema.index({ location: '2dsphere' });
const ShopKeeper = mongoose.model("ShopKeeper", ShopKeeperSchema);

module.exports = ShopKeeper;