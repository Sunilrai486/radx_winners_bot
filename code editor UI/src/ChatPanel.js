import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SwitchButton from './SwitchButton';
// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ChatPanel() {
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [headingText, setHeadingText] = useState('Task Master')
    const [responseData, setResponseData] = useState('')

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
            setHeadingText('Junior Bot')
        } else {
            setMessages(taskmaster_messages, () => {
                console.log(taskmaster_messages);
            }); 
            setHeadingText('Task Master')
        }
    }, [isSwitchOn, juniorbot_messages, taskmaster_messages]);

    const messagesContainerRef = React.useRef(null);
    useEffect(() => {
        messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentBotResponseChunks]);

    const handleUserSubmit = async (query) => {

        if(juniorbot_messages.length == 0 && isSwitchOn){
            setBMessages([...juniorbot_messages, { type: 'user', content: query }]);
        }
        else if(taskmaster_messages.length == 0 && isSwitchOn === false){
            setTMMessages([...taskmaster_messages, { type: 'user', content: query }]);
        }
        else if(isSwitchOn && juniorbot_messages.length > 1){
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
                if(taskmaster_messages !== "" && juniorbot_messages === ""){
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
            var responsedata = data.body.response;
            // alert(responsedata)



            
            // // Define a regular expression to match triple-backtick code blocks
            // const regex = /```([\s\S]*?)```/;

            // // Use the regex to find the first code block
            // const match = regex.exec(responsedata);
            // var languageName = "";
            // var restOfTheCode = "";
            // if (match) {
            //     // The first code block content is in match[1]
            //     const firstCodeBlockContent = match[1];
                
            //     console.log("First Code Block Content:");
            //     console.log(firstCodeBlockContent);
            
            //     // Use regular expressions to extract the language name and code
            //     const languageRegex = /^(\w+)\s+/; // Matches the language name at the beginning of the code
            //     const languageMatch = firstCodeBlockContent.match(languageRegex);

            //     if (languageMatch) {
            //         languageName = languageMatch[1];
            //         restOfTheCode = firstCodeBlockContent.replace(languageRegex, '');
                
            //         console.log('Language Name:', languageName);
            //         console.log('Rest of the Code:', restOfTheCode);
            //     } else {
            //         console.log('Language not found in the code.');
            //     }

            //     // Render the code block with syntax highlighting
            //     const highlightedCode = (
            //         <SyntaxHighlighter language={languageName} style={prism}>
            //             {restOfTheCode}
            //         </SyntaxHighlighter>
            //     );
                
            //     // Replace the code block in the response data with the highlighted code
            //     responsedata = responsedata.replace(firstCodeBlockContent, highlightedCode);
            //     console.log(responsedata)

            // } else {
            //     console.log("No code block found in the input string.");
            // }

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
                setCurrentBotResponseChunks([]);
                setIsBotTyping(false);

                if(isSwitchOn){
                    setBMessages(prev => [...prev, { type: 'bot', content: responsedata }]);
                }else{
                    setTMMessages(prev => [...prev, { type: 'bot', content: responsedata }]);
                    if(juniorbot_messages.length == 0){
                        setIsSwitchOn(true);
                        setBMessages([...juniorbot_messages, { type: 'user', content: responsedata }]);
                        setResponseData(responsedata)
                    }
                }
            }, 1000 * chunks.length);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    // Use a useEffect to call handleUserSubmit when isSwitchOn is true and juniorbot_messages is updated
    useEffect(() => {
        if (isSwitchOn && juniorbot_messages.length === 1) {
            handleUserSubmit(responseData);
        }
    }, [isSwitchOn, juniorbot_messages, responseData]);

    return (
        <div className="chat-panel">
            <SwitchButton onToggle={handleToggleSwitch} isOn={isSwitchOn}/>
            <h4>{headingText}</h4>
            <MessageList messages={messages} currentBotResponseChunks={currentBotResponseChunks} ref={messagesContainerRef} />
            <InputArea onSubmit={handleUserSubmit} isBotTyping={isBotTyping} />
        </div>
    );
}

export default ChatPanel;
