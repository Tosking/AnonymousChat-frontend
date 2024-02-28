import React, { useState, useEffect, useContext } from 'react'
import { ConnectionContext } from './ConnectionContext';

function CreateChatroom() {
    const [chatRoomName, setChatRoomName] = useState(null);

    const connection = useContext(ConnectionContext)

    const createChatroom = async () => {
        try {
            await connection.send('CreateChatroom', localStorage.getItem('token'), chatRoomName);
            setChatRoomName('');
        } catch (error) {
            console.error('Error creating chatroom:', error);
        }
    };

    return (
        <ul>
            <input type="text" value={chatRoomName} onChange={e => setChatRoomName(e.target.value)} placeholder='Chatroom name'/>
            <button onClick={createChatroom}>Create</button>
        </ul>
    )
}

export default CreateChatroom