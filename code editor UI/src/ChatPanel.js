import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SwitchButton from './SwitchButton';

function ChatPanel() {
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [headingText, setHeadingText] = useState('Task Master')

    var [messages, setMessages] = useState([]);

    const [taskmaster_messages, setTMMessages] = useState([]);
    const [juniorbot_messages, setBMessages] = useState([]);

    const [currentBotResponseChunks, setCurrentBotResponseChunks] = useState([]);
    const [isBotTyping, setIsBotTyping] = useState(false);

    const handleToggleSwitch = (newState) => {
        if(newState){
            // setBMessages([...juniorbot_messages, { type: 'user', content: "Hi Junior!" }]);
            // setBMessages(prev => [...prev, { type: 'bot', content: "Hello Bro!" }]);
            setIsSwitchOn(true);
        }else{
            // setTMMessages([...taskmaster_messages, { type: 'user', content: "Hi Master!" }]);
            // setTMMessages(prev => [...prev, { type: 'bot', content: "Hello Student!" }]);       
            setIsSwitchOn(false);
        }

        setHeadingText(newState ? 'Junior Bot': 'Task Master' )
    };
      // Use useEffect to update messages when the toggle is already on
    useEffect(() => {
        if (isSwitchOn) {
            setMessages(juniorbot_messages, () => {
                console.log(juniorbot_messages);
            }); 
        } else {
            setMessages(taskmaster_messages, () => {
                console.log(taskmaster_messages);
            }); 
        }
    }, [isSwitchOn, juniorbot_messages, taskmaster_messages]);

    const messagesContainerRef = React.useRef(null);
    useEffect(() => {
        messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentBotResponseChunks]);

    const handleUserSubmit = async (query) => {

        if(messages == [] && isSwitchOn){
            setBMessages([...juniorbot_messages, { type: 'user', content: query }]);
        }
        else if(messages == [] && isSwitchOn === false){
            setTMMessages([...taskmaster_messages, { type: 'user', content: query }]);
        }
        else if(isSwitchOn){
            setBMessages(prev => [...prev, { type: 'user', content: query }]);
        }
        else if(isSwitchOn === false){
            setTMMessages(prev => [...prev, { type: 'user', content: query }]);
        }
        setIsBotTyping(true);
        
        try {
            var baseURL = "http://127.0.0.1:5000";
            var apiURL = "";
            var method = "GET";
            
            if(isSwitchOn){
                apiURL = baseURL + "/juniorbot/"
            }else{
                apiURL = baseURL + "/taskmaster/"
            }

            if(query !== ""){
                apiURL = apiURL + "query"
                if(taskmaster_messages !== "" || juniorbot_messages === ""){
                    apiURL = apiURL + "task"
                }
                method = "POST"
            }

            const requestOptions = {
                method: method,
            };
            
            if (method === 'POST') {
                requestOptions.headers = {
                    'Content-Type': 'application/json',
                };
                
                if (query) {
                    requestOptions.body = JSON.stringify({ query });
                }
            }

            const result = await fetch(apiURL, requestOptions);              

            const data = await result.json();
            const responsedata = data.body.response.trim();
            const words = responsedata.split(' ');
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
                if(isSwitchOn){
                    setBMessages(prev => [...prev, { type: 'bot', content: responsedata }]);
                }else{
                    setTMMessages(prev => [...prev, { type: 'bot', content: responsedata }]);
                }
                setCurrentBotResponseChunks([]);
                setIsBotTyping(false);
            }, 1000 * chunks.length);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    return (
        <div className="chat-panel">
            <SwitchButton onToggle={handleToggleSwitch}/>
            <h4>{headingText}</h4>
            <MessageList messages={messages} currentBotResponseChunks={currentBotResponseChunks} ref={messagesContainerRef} />
            <InputArea onSubmit={handleUserSubmit} isBotTyping={isBotTyping} />
        </div>
    );
}

export default ChatPanel;
