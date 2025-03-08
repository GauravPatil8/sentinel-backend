const express = require("express");
const { handleCustomerSignup, handleCustomerlogin} = require("../controller/Customer");
const { handleShopkeeperSignup, handleShopkeeperLogin} = require("../controller/Shopkeeper");

const router = express.Router();

router.post("/signup/customer", handleCustomerSignup);

router.post("/login/customer", handleCustomerlogin);

router.post("/signup/shopkeeper", handleShopkeeperSignup);

router.post("/login/shopkeeper", handleShopkeeperLogin);


module.exports = router;