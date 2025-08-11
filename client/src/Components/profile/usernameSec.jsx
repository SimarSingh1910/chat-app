import React from 'react'

const UsernameSec = ({ user }) => {
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