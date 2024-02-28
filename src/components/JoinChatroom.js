import React, { useState, useEffect, useContext } from 'react'
import { ConnectionContext } from './ConnectionContext';
function JoinChatroom() {
    const [chatRoomId, setChatRoomId] = useState(null);
    const connection = useContext(ConnectionContext)

    const joinChatroom = async () => {
        try {
            await connection.send('JoinChatroom', localStorage.getItem('token'), chatRoomId);
            setChatRoomId('');
        } catch (error) {
            console.error('Error joining chatroom:', error);
        }
    };

    return (
        <ul>
            <input type="text" value={chatRoomId} onChange={e => setChatRoomId(e.target.value)} placeholder='Chatroom name'/>
            <button onClick={joinChatroom}>Join</button>
        </ul>
    )
}

export default JoinChatroom