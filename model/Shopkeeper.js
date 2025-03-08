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
            type: String
        },
        services: {
            type: [String]
        },
        location: {
            type: "Point",
            coordinates: [Number]
        }
    },
    {timestamps: true},
);

const ShopKeeper = mongoose.model("ShopKeeper", ShopKeeperSchema);

module.exports = ShopKeeper;