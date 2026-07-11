import React, { useLayoutEffect, useRef } from 'react';

const ChatPanel = ({ messages }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  // scroll to bottom after DOM updates
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // instant jump to bottom (reliable)
    el.scrollTop = el.scrollHeight;
    // alternatively: el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length]); // run when messages length changes

const hasWhitespace = (text) => /\s/.test(text);

return (
  <div
    ref={containerRef}
    className="
      border
      h-[76vh]
      overflow-y-auto
      flex
      flex-col
      justify-end
    "
  >
    <div className="px-2 py-2 space-y-2">
      {messages.map((msg) => {
        const text = msg.text ?? msg;

        return (
          <div
            key={msg.id ?? Math.random()}
            className={`
              p-2
              rounded-md
              bg-white
              border
              whitespace-pre-wrap
              ${
                hasWhitespace(text)
                  ? 'break-words'
                  : 'break-all [overflow-wrap:anywhere]'
              }
            `}
          >
            {text}
          </div>
        );
      })}
    </div>
  </div>
);
};

export default ChatPanel;
