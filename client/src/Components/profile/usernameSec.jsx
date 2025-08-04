import React, { useEffect, useState } from 'react'

const UsernameSec = () => {
    const [user, setuser] = useState("");
    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await fetch("http://localhost:3000/profile", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await res.json();
                setuser(data.user);
            } catch (err) {
                console.log(err);
            }
        }

        getUserData();

    }, [])


    return (
        <div className='text-center mt-2'>
            {user ?
                <>
                    <p>{user.first_name} {user.last_name}</p>
                    <p>@{user.username}</p>
                </>
                :
                <p>Loading...</p>
            }

        </div>
    )
}

export default UsernameSec