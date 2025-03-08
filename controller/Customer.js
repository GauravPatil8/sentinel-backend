require("dotenv").config();
const Customer = require("../model/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function handleCustomerSignup(req, res) {
    
    const { name, email, password} = req.body;

    try {
        if(!email || !password || !name) return res.status(400).json({error: "Email and Password and name are required"});
        const existingCustomer = await Customer.findOne({ email });
        if(existingCustomer) return res.status(400).json({  error: "Customer already exists."});
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await Customer.create({ name, email, password: hashedPassword});

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

}

async function handleCustomerlogin(req, res) {
    const { email, password } = req.body;
    try {
        if(!email || !password) return res.status(400).json({error: "Email and Password are required"});
        const existingCustomer = await Customer.findOne({ email });
        if(!existingCustomer) return res.status(400).json("Customer doesn't Exist");
        
        const isMatch = await bcrypt.compare(password, existingCustomer.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: existingCustomer._id }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true, // Prevents access via JavaScript
            sameSite: "Strict", // Prevents CSRF attacks
            secure: true
        });

        res.status(201).json({id: existingCustomer._id, name: existingCustomer.name, email: existingCustomer.email });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = {
    handleCustomerSignup,
    handleCustomerlogin
};