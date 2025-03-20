const { Server } = require("socket.io");
const crypto = require("crypto");
let io; 
const connectedUsers = {}; // Store user connections

function initializeSocket(server) {
    // const dh = crypto.createDiffieHellman(256);
    // const prime = dh.getPrime("hex");
    // const generator = dh.getGenerator("hex");

    io = new Server(server, {
        cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        console.log(connectedUsers);
        // Register user
        socket.on("register", ({ userId }) => {
            if (connectedUsers[userId]) {
                clearTimeout(connectedUsers[userId].timeout); // Reset timeout if user reconnects
            }
            
            connectedUsers[userId] = {
                socketId: socket.id,
                timeout: setTimeout(() => {
                    if (connectedUsers[userId]) {
                        socket.emit("message", "Your session has expired.");
                        socket.disconnect(); // Disconnect user
                        delete connectedUsers[userId]; // Remove from list
                        console.log(`User ${userId} forcefully disconnected after timeout.`);
                    }
                }, 1500000000) 
            };
            console.log(connectedUsers);
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
        });

        // Shopkeeper sends public key to customer
        socket.on("shpkpr_public_key", ({customerId, publicKey, shopId}) => {
            console.log("shopkeeper key emit hogaya");
            if (connectedUsers[customerId]) {
                io.to(connectedUsers[customerId].socketId).emit("shopKeeperKey", {publicKey, shopId});
                console.log(connectedUsers[customerId].socketId);

            } else {
                console.log(`Customer ${customerId} not found.`);
            }
        });

        // Customer sends prime & generator to shopkeeper
        socket.on("customer_encrypted_key", ({customerPublicKey, encryptedData, shopId}) => {
            if (connectedUsers[shopId]) {
                io.to(connectedUsers[shopId].socketId).emit("customerKey", {customerPublicKey, encryptedData});
            } else {
                console.log(`Shopkeeper ${shopId} not found.`);
            }
        });

        // Customer sends encrypted key to shopkeeper
        socket.on("encrypted_key", ({shopId, encryptedData}) => {
            if (connectedUsers[shopId]) {
                io.to(connectedUsers[shopId].socketId).emit("key", encryptedData);
            } else {
                console.log(`Shopkeeper ${shopId} not found.`);
            }
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            const user = Object.keys(connectedUsers).find(key => connectedUsers[key].socketId === socket.id);
            if (user) {
                clearTimeout(connectedUsers[user].timeout);
                delete connectedUsers[user];
                console.log(`User ${user} disconnected.`);
            }
        });
    });
}

function getSocketInstance() {
    if (!io) {
        throw new Error("Socket.IO not initialized!");
    }
    return io;
}

module.exports = { 
    initializeSocket, 
    getSocketInstance 
};
