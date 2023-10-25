import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

function Message({ type, content }) {
    // if the message is from the user, sanitize the content
    const sanitizedContent = type === 'user' ? DOMPurify.sanitize(content) : content;
    // apply chunk only if it's a bot message and it's relatively short, indicating it's a chunk.
    const className = type === 'bot' && content.split(' ').length <= 5 ? 'chunk' : ''; 

    return (
        <div className={`message ${type} ${className}`}>
            <ReactQuill value={sanitizedContent} readOnly={true} theme={null}/>
        </div>
    )
}

Message.ropTypes = {
    type: PropTypes.oneOf(['user', 'bot']).isRequired,
    content: PropTypes.string.isRequired
};

Message.defaultProps = {
    type: 'user',
    content: 'Default message content'
};

export default Message;