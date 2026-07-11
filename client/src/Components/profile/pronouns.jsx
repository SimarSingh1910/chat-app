import React from 'react'

const Pronouns = ({ value, setValue }) => {
    return (
        <div>
            <label htmlFor="pronoun" className='mb-1.5 block text-sm font-medium text-slate-700'>Pronouns</label>
            <input
                type="text"
                name="pronoun"
                id="pronoun"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className='w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                placeholder='e.g. He/Him, She/Her, They/Them'
            />
        </div>
    )
}

export default Pronouns
