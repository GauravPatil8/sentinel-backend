const fs = require("fs");
const CryptoJS = require("crypto-js");

// Generate AES key and IV (should be shared later)
const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012"); // 32 bytes
const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16 bytes

function encryptFile(filePath) {
    const fileData = fs.readFileSync(filePath);
    const wordArray = CryptoJS.lib.WordArray.create(fileData);
    const encrypted = CryptoJS.AES.encrypt(wordArray, key, { iv: iv, mode: CryptoJS.mode.CBC });

    return encrypted.toString();
}

// Add files you want to encrypt
const files = ["requirements.pdf", "ss1.png"];  // Update with actual file paths
let encryptedFiles = files.map(file => ({
    fileName: file,
    encryptedData: encryptFile(file)
}));

// Create JSON output
const outputData = {
    encryptedFiles,
    aesKey: CryptoJS.enc.Base64.stringify(key),
    aesIV: CryptoJS.enc.Base64.stringify(iv)
};

// Save to a file
fs.writeFileSync("encrypted_output.json", JSON.stringify(outputData, null, 2));

console.log("✅ Encrypted output saved to 'encrypted_output.json'. Open the file to copy the data.");
