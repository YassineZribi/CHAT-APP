import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Join.css';

const Join = () => {
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div><input placeholder="Name" className="joinInput" value={ name } onChange={ (e) => setName(e.target.value) } type="text" /></div>
                <div><input placeholder="Room" className="joinInput mt-20" value={ room } onChange={ (e) => setRoom(e.target.value) } type="text" /></div>
                <Link onClick={ (e) => (!name || !room) && e.preventDefault() } to={ `/chat?name=${name}&room=${room}` }>
                    <button className="button mt-20" type="submit">Sign In</button>
                </Link>
            </div>
        </div>
    );
};

export default Join;
