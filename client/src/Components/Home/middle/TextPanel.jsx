import React, { useState } from 'react';
import sendIcon from '../../../assets/send-4008.svg';

const TextPanel = ({ addMessage }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (inputValue.trim()) {
            addMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="pl-2 pr-2">
            <div className="relative">
                <textarea
                    rows={1}
                    placeholder="Type a message"
                    className="bg-gray-100 w-full min-h-[44px] px-4 py-2 border-0 rounded-full resize-none overflow-hidden focus:outline-none focus:ring-0"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                />

                <img
                    src={sendIcon}
                    alt="Send"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
                    onClick={handleSend}
                />
            </div>
        </div>
    );

}
export default TextPanel;