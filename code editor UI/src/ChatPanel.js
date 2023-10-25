import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';

function ChatPanel() {
    const [messages, setMessages] = useState([]);
    const [currentBotResponseChunks, setCurrentBotResponseChunks] = useState([]);
    const [isBotTyping, setIsBotTyping] = useState(false);

    const messagesContainerRef = React.useRef(null);
    useEffect(() => {
        messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentBotResponseChunks]);

    const handleUserSubmit = async (query) => {
        setMessages([...messages, { type: 'user', content: query }]);
        setIsBotTyping(true);
        
        try {
            const result = await fetch('/api/query-vertex', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            const data = await result.json();
            const words = data.response.trim().split(' ');
            let chunks = [];

            while (words.length) {
                chunks.push(words.splice(0, 5).join(' ')); // Breaking the message into chunks of 5 words
            }

            console.log("Starting chunk logic");
            console.log("NUMBER OF CHUNKS: ", chunks.length);
            chunks.forEach((chunk, index) => {
                setTimeout(() => {
                    setCurrentBotResponseChunks(prevChunks => [...prevChunks, chunk]);
                }, 1000 * index);
            });
            console.log("Ending chunk logic");

            // After all chunks are revealed, add the entire response to the messages and clear the currentBotResponseChunks
            setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
                setCurrentBotResponseChunks([]);
                setIsBotTyping(false);
            }, 1000 * chunks.length);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    return (
        <div className="chat-panel">
        <h4>ReX</h4>
            <MessageList messages={messages} currentBotResponseChunks={currentBotResponseChunks} ref={messagesContainerRef} />
            <InputArea onSubmit={handleUserSubmit} isBotTyping={isBotTyping} />
        </div>
    );
}

export default ChatPanel;
