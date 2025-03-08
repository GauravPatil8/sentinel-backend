const Customer = require("../model/Customer");

async function testSignup(req, res){
    
    await Customer.create({
        name: "Gaurav",
        email: "gauravpatil@gmail.com", //dusri baar test karne ke liye email change karna
        password: "abc"
    });

    return res.end("user banra");
}

module.exports = {
    testSignup,
};