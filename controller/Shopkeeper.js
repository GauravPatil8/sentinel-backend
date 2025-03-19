require("dotenv").config();
const ShopKeeper = require("../model/Shopkeeper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function handleShopkeeperSignup(req, res) {
    const { name, email, password, shopName, address, services, location } = req.body;

    try {
        if (!email || !password || !name || !shopName) {
            return res.status(400).json({ error: "Fields are required" });
        }

        const existingShopKeeper = await ShopKeeper.findOne({ email });
        if (existingShopKeeper) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Fix: Ensure valid coordinates are stored
        const shopLocation = {
            type: "Point",
            coordinates: Array.isArray(location?.coordinates) && location.coordinates.length === 2
                ? location.coordinates  // Use provided coordinates
                : [0, 0] // Default to [0,0] if location is missing
        };

        await ShopKeeper.create({
            name,
            email,
            password: hashedPassword,
            shopName,
            address,
            services: services || [],
            location: shopLocation,  // ✅ Store proper location
        });

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function handleShopkeeperLogin(req, res) {
    console.log("Received login request for shopkeeper:", req.body.email);
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are required" });
        }

        // Debugging: Fetch all shopkeepers
        const allShopkeepers = await ShopKeeper.find({});
        console.log("All Shopkeepers in DB:", allShopkeepers);

        // Debugging: Check if shopkeeper exists
        const existingShopkeeper = await ShopKeeper.findOne({ email });
        console.log("Found Shopkeeper:", existingShopkeeper);

        if (!existingShopkeeper) {
            return res.status(400).json({ error: "Shopkeeper doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, existingShopkeeper.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: existingShopkeeper._id },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        // Return all required details
        const responseData = {
            id: existingShopkeeper._id,
            name: existingShopkeeper.name,
            email: existingShopkeeper.email,
            shopName: existingShopkeeper.shopName,
            token: token
        };

        console.log("Sending Response:", responseData);
        res.status(200).json(responseData);
    } catch (error) {
        console.error("🔥 Server Error in Shopkeeper Login:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    handleShopkeeperSignup,
    handleShopkeeperLogin
};