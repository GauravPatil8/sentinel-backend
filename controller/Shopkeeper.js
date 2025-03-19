require("dotenv").config();
const ShopKeeper = require("../model/Shopkeeper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function handleShopkeeperSignup(req, res) {
    const { name, email, password, shopName, address, services, location } = req.body;

    try {
        if(!email || !password || !name || !shopName) return res.status(400).json({error: "Fields are required"});
        const existingShopKeeper = await ShopKeeper.findOne({ email });
        if (existingShopKeeper) return res.status(400).json({ message: "Email already in use" });

        
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const newShopkeeper = await ShopKeeper({
            name,
            email,
            password: hashedPassword,
            shopName,
            address,
            services: services || [], 
            location: {
                type: "Point",
                coordinates: location?.coordinates || [0, 0], 
            }
        });
        await newShopkeeper.save();

        const token = jwt.sign(
            { id: newShopkeeper._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "3h" } // Token expires in 3 hours
        );

        res.cookie("token", token, {
            httpOnly: true, 
            sameSite: "Strict",
            secure: true 
        });
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function handleShopkeeperLogin(req, res) {
    const { email, password } = req.body;

    try {
        const existingShopkeeper = await ShopKeeper.findOne({email});
        if(!existingShopkeeper) return res.status(400).json("Customer doesn't Exist");

        const isMatch = await bcrypt.compare(password, existingShopkeeper.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: existingShopkeeper._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "3h" } // Token expires in 3 hours
        );

        res.cookie("token", token, {
            httpOnly: true, 
            sameSite: "Strict",
            secure: true 
        });

        res.status(200).json({ 
            id: existingShopkeeper._id, 
            name: existingShopkeeper.name, 
            email: existingShopkeeper.email,
            shopName: existingShopkeeper.shopName,
            token: token  // Include token in response
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = {
    handleShopkeeperSignup,
    handleShopkeeperLogin
};