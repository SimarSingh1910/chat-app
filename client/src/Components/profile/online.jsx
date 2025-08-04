import React from "react"; 

const ProfileSettings = ({value,setValue}) => {

    return (
        <div className="mx-5 mt-2 space-y-4">
            <div>
                <label className="font-medium block mb-1">Online Status</label>
                <select
                    value={value}
                    onChange={(e)=> setValue(e.target.value)}
                    className="border border-gray-300 w-1/3 mt-2 rounded-lg placeholder:text-gray-700 bg-gray-100 p-2 focus:outline-none focus:ring-1 focus:ring-black"
                >
                    <option value="active">Active</option>
                    <option value="dnd">Do Not Disturb</option>
                    <option value="away">Away</option>
                    <option value="invisible">Invisible</option>
                </select>
            </div>
        </div>
    );
};

export default ProfileSettings;
