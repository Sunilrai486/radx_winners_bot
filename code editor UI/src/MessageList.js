import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Message from './Message';

function MessageList({ messages, currentBotResponseChunks }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, currentBotResponseChunks]);

    return (
        <div className='messages'>
            {messages.map((message, idx) => (
                <Message key={idx} type={message.type} content={message.content}/>
            ))}
            {currentBotResponseChunks.length > 0 && (
                <div className="message bot">
                    {currentBotResponseChunks.map((chunk, idx) => (
                        <span key={idx} className="chunk">{chunk} </span>
                    ))}
                </div>
            )}

            <div ref={messagesEndRef}></div>
        </div>
    );
}

MessageList.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf(['user', 'bot']).isRequired,
        content: PropTypes.string.isRequired
    })).isRequired,
    currentBotResponseChunks: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default MessageList;
