const { Server } = require("socket.io");

let io; 
const connectedUsers = {}; // Store user connections

function initializeSocket(server) {
    io = new Server(server, {
        cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

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
                }, 120000) // Auto-disconnect after 120 seconds
            };
            console.log(connectedUsers);
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
        });

        // Shopkeeper sends public key to customer
        socket.on("shpkpr_public_key", ({customerId, public_key}) => {
            if (connectedUsers[customerId]) {
                io.to(connectedUsers[customerId].socketId).emit("shopKeeperKey", public_key);
                console.log(connectedUsers[customerId].socketId);

            } else {
                console.log(`Customer ${customerId} not found.`);
            }
        });

        // Customer sends prime & generator to shopkeeper
        socket.on("customer_prime_generator", ({prime, generator, customerPublicKey, shopId}) => {
            if (connectedUsers[shopId]) {
                io.to(connectedUsers[shopId].socketId).emit("getCustomerInfo", { 
                    prime, 
                    generator, 
                    customerKey: customerPublicKey 
                });
            } else {
                console.log(`Shopkeeper ${shopId} not found.`);
            }
        });

        // Customer sends encrypted key to shopkeeper
        socket.on("encrypted_key", ({shopId, encryptedKey}) => {
            if (connectedUsers[shopId]) {
                io.to(connectedUsers[shopId].socketId).emit("key", encryptedKey);
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