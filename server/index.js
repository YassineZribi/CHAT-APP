const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./helpers/users");
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
    // console.log("We have a new connection!!!");
    socket.on("join", ({ name, room }, callback) => {
        // console.log({ name, room });
        const { error, user } = addUser({ id: socket.id, name, room });
        console.log({ room });
        if (error) return callback(error);

        //if there are no errors:

        // (2) and finally when user is inside a room we can handle a fun stuff messaging events and messages
        // (2) simple welcome message for any user joins a room
        socket.emit("message", { user: "admin", text: `${user.name}, welcome to the room ${user.room}` });
        // (2) send message to everybody else inside the specific room to inform them that a specific user has joined the room.
        socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name}, has joined!` });
        // (1) we are going to call a built-in socket method which is called join (it just joins a user in a specific room)
        socket.join(user.room);
        // get all users inside specific room to show the list on connected users 
        io.to(user && user.room).emit("roomData", { room: user && user.room, users: getUsersInRoom(user && user.room) });

        callback();

    });

    // Now, let's create events for user generated messages
    socket.on("sendMessage", (message, callback) => {
        // get user who send the msg
        const user = getUser(socket.id);

        io.to(user && user.room).emit("message", { user: user && user.name, text: message });
        // and afterwards you always want to call this callback so we can actually do something on the front end after the message is sent 
        callback();
    });

    socket.on("disconnect", () => {
        // console.log("User had left!!!");
        const user = removeUser(socket.id);

        if (user) {
            io.to(user && user.room).emit("message", { user: "admin", text: `${user.name} has left.` });
            // when the user leaves the room, we need to know the new state of users in the room
            io.to(user && user.room).emit("roomData", { room: user && user.room, users: getUsersInRoom(user && user.room) });
        }
    });
});

// middleware
app.use(router);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));