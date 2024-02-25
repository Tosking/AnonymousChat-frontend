import React, { useState, useEffect } from 'react'

function CreateChatroom(props) {
    let connection;
    const [chatRoomName, setChatRoomName] = useState(null);

    useEffect(() => {
        connection = props.connection
    })

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