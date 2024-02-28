import React, { useState, useEffect, useContext } from 'react'
import { ConnectionContext } from './ConnectionContext';

function CreateUser() {
    const [username, setUsername] = useState('');

    const connection = useContext(ConnectionContext)

    const createUser = async () => {
        try {
            await connection.send('CreateUser', username);
            setUsername('');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <ul>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder='name'/>
            <button onClick={createUser}>Create</button>
        </ul>
    )
}

export default CreateUser