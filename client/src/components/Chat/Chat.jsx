import React, { useState, useEffect } from 'react';

import queryString from 'query-string';
import io from "socket.io-client";

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css';


let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const ENDPOINT = "localhost:5000";
    // basic setup for users joining and users disconnecting
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        // ["123", "124"].forEach((number) => {
        //     console.log(number);
        //     socket.emit("join", { name, room: number }, (error) => {
        //         console.log(" from join callback", error);
        //     });
        // });
        socket.emit("join", { name, room }, (error) => {
            console.log(" from join callback", error);
        });

        //console.log({ socket }); instance of socket;
        return () => {
            socket.emit("disconnect");

            socket.off();
        };
    }, [ENDPOINT, location.search]);

    // this useEffect is used for handling messages
    useEffect(() => {
        socket.on("message", (message) => {
            // adding every new message sent by admin or anyone else to our messages array
            setMessages([...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
        return () => {
            //
        };
    }, [messages]);

    // create a function for sending messages
    const sendMessage = (e) => {
        e.preventDefault();

        if (message) {
            socket.emit("sendMessage", message, () => setMessage("")); // third parameter is a callback function executed when we call the callback func in the back-end so when we send the message our input field clears
        }
    };

    console.log({ message, messages });

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={ room } />
                <Messages messages={ messages } name={ name } />
                <Input message={ message } setMessage={ setMessage } sendMessage={ sendMessage } />

            </div>
            <TextContainer users={ users } />
        </div>
    );
};

export default Chat;
