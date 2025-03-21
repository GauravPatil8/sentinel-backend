const express = require("express");
const router = express.Router();
const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/send-whatsapp", async (req, res) => {
  try {
    const { shopkeeperNumber, shareLink } = req.body;

    if (!shopkeeperNumber) {
      return res.status(400).json({ error: "Missing shopkeeper number" });
    }

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Your Twilio business WhatsApp number
      to: `whatsapp:+91${shopkeeperNumber}`, // Shopkeeper's WhatsApp number
      body: `Hi! You have received a print request from Safe Printing. Access: ${shareLink}`, // Customizable message
    });
    
    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error("WhatsApp Message Error:", error);
    res.status(500).json({ error: "Failed to send WhatsApp message" });
  }
});

module.exports = router;
