import React, { useState } from "react";
import PropTypes from 'prop-types';

function InputArea({ onSubmit, isBotTyping }) {
    const [query, setQuery] = useState('');
    const [rows, setRows] = useState(1);

    const handleSend = () => {
        if (query.trim() !== '') {
            onSubmit(query);
            setQuery('');
            setRows(1);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent newline
            handleSend();
        } else if (e.key === 'Enter' && e.shiftKey && rows < 5) {
            setRows(rows + 1);
        }
    };

    return (
        <div className="input-area">
            <textarea 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={rows}
                disabled={isBotTyping}
                placeholder="Send a message"
            />
            <button onClick={handleSend} disabled={isBotTyping}>Send</button>
        </div>
    );   
}

InputArea.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isBotTyping: PropTypes.bool.isRequired
};


export default InputArea;