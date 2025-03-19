require("dotenv").config();
const Customer = require("../model/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function handleCustomerSignup(req, res) {
    console.log("recieved signup req");
    const { name, email, password} = req.body;

    try {
        if(!email || !password || !name) return res.status(400).json({error: "Email and Password and name are required"});
        const existingCustomer = await Customer.findOne({ email });
        if(existingCustomer) return res.status(400).json({  error: "Customer already exists."});
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = Customer({ name, email, password: hashedPassword});
        await newCustomer.save();
        const token = jwt.sign(
            { id: newCustomer._id },
            process.env.JWT_SECRET,  
            { expiresIn: "1h" } 
        );
        console.log(token);
        res.cookie("token", token, {
            httpOnly: true, 
            sameSite: "Strict",
            secure: false
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

}

async function handleCustomerlogin(req, res) {
    console.log("Recieved login req", req.body.email);
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ error: "Email and Password are required" });

        const existingCustomer = await Customer.findOne({ email });
        if (!existingCustomer) return res.status(400).json({ error: "Customer doesn't exist" });

        const isMatch = await bcrypt.compare(password, existingCustomer.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

       // generating jwt token 
        const token = jwt.sign(
            { id: existingCustomer._id },
            process.env.JWT_SECRET,  
            { expiresIn: "1h" } 
        );

        res.cookie("token", token, {
            httpOnly: true, 
            sameSite: "Strict",
            secure: false
        });

        console.log("Login successfull");
        res.status(200).json({
            id: existingCustomer._id,
            name: existingCustomer.name,
            email: existingCustomer.email,
            token: token  //token was needed to send the print - request 
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    handleCustomerSignup,
    handleCustomerlogin
};