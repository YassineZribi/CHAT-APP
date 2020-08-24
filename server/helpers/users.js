// inside of this file, we are going to create helper functions that are going 
// to help us manage users and manage users joining in, signing out, removing users, 
// getting users, adding users, everything that has to do with users even keeping track
// of what users are and in what rooms

const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.name === name);

    if (existingUser) {
        return { error: "Username is taken" };
    }

    const user = { id, name, room };

    users.push(user);

    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => users.find((user) => user.id === id); // get user who send the msg

const getUsersInRoom = (room) => users.filter((user) => user.room === room);


module.exports = { addUser, removeUser, getUser, getUsersInRoom };