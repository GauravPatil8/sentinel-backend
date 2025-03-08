const Customer = require("../model/Customer");

async function testSignup(req, res){
    
    await Customer.create({
        name: "Gaurav",
        email: "gauravpatil@gmail.com",
        password: "abc"
    });

    return res.end("user banra");
}

module.exports = {
    testSignup,
};