import React, { useState, useEffect } from 'react'

function CreateUser(props) {
    let connection;
    const [username, setUsername] = useState('');

    useEffect(() => {
        connection = props.connection
    })
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