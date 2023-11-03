// import React from 'react';
// import PropTypes from 'prop-types';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import DOMPurify from 'dompurify';

// import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

// function Message({ type, content }) {
//     // if the message is from the user, sanitize the content
//     const sanitizedContent = type === 'user' ? DOMPurify.sanitize(content) : content;
//     // apply chunk only if it's a bot message and it's relatively short, indicating it's a chunk.
//     const className = type === 'bot' && content.split(' ').length <= 5 ? 'chunk' : ''; 

//     // Check if the message contains a code block
//     const codeBlockRegex = /```([\s\S]*?)```/;
//     var codeBlockMatch = codeBlockRegex.exec(sanitizedContent);
//     var languageName = "";
//     var restOfTheCode = "";
//     if (codeBlockMatch) {
//         var firstCodeBlockContent = codeBlockMatch[1];

//         const languageRegex = /^(\w+)\s+/; // Matches the language name at the beginning of the code
//         var languageMatch = firstCodeBlockContent.match(languageRegex);

//         if (languageMatch) {
//             languageName = languageMatch[1];
//             restOfTheCode = firstCodeBlockContent.replace(languageRegex, '');
//         }

//         var resstring = sanitizedContent.replace(codeBlockMatch[1], '').split("``````")
        
//         alert(resstring[1])

        
//         var resstring2 = ""
//         var languageName2 = ""
//         var restOfTheCode2 = ""

//         var codeBlockMatch2 = codeBlockRegex.exec(resstring[1]);
//         alert(codeBlockMatch2)
//         if(codeBlockMatch2){
//             firstCodeBlockContent = codeBlockMatch2[1];
//             languageMatch = firstCodeBlockContent.match(languageRegex);

//             if (languageMatch) {
//                 languageName2 = languageMatch[1];
//                 restOfTheCode2 = firstCodeBlockContent.replace(languageRegex, '');
//             }
//             resstring2 = resstring[1].replace(codeBlockMatch2[0], '')
//         }else{
//             resstring2 = resstring[1]
//         }
//         // Render the code block with syntax highlighting
//         return (
//             <div className={`message ${type} ${className}`}>
//                 <ReactQuill value={resstring[0]} readOnly={true} theme={null}/>
//                 <SyntaxHighlighter language={languageName} style={prism} wrapLines={true} showLineNumbers={true}>
//                     {restOfTheCode}
//                 </SyntaxHighlighter>
//                 <ReactQuill value={resstring2} readOnly={true} theme={null}/>
//                 <SyntaxHighlighter language={languageName2} style={prism} wrapLines={true} showLineNumbers={true}>
//                     {restOfTheCode2}
//                 </SyntaxHighlighter>
//             </div>
//         );
//     }
//     return (
//         <div className={`message ${type} ${className}`}>
//             <ReactQuill value={sanitizedContent} readOnly={true} theme={null}/>
//         </div>
//     )
// }

// Message.ropTypes = {
//     type: PropTypes.oneOf(['user', 'bot']).isRequired,
//     content: PropTypes.string.isRequired
// };

// Message.defaultProps = {
//     type: 'user',
//     content: 'Default message content'
// };

// export default Message;