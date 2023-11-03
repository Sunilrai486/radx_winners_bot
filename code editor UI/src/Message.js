import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

function Message({ type, content }) {
    // If the message is from the user, sanitize the content
    const sanitizedContent = type === 'user' ? DOMPurify.sanitize(content) : content;

    // Apply chunk only if it's a bot message and it's relatively short, indicating it's a chunk.
    const className = type === 'bot' && content.split(' ').length <= 5 ? 'chunk' : '';

    // Initialize arrays to store Quill and SyntaxHighlighter segments
    const quillSegments = [];
    const syntaxHighlighterSegments = [];

    // Regular expression to find code blocks
    const codeBlockRegex = /```([\s\S]*?)```/g;

    let lastIndex = 0;
    let match;
    while ((match = codeBlockRegex.exec(sanitizedContent)) !== null) {
        // Store the Quill segment before the code block
        const preCodeSegment = sanitizedContent.substring(lastIndex, match.index);
        quillSegments.push(preCodeSegment);

        // Store the code block segment
        const codeBlockContent = match[0];
        syntaxHighlighterSegments.push(codeBlockContent);

        lastIndex = match.index + codeBlockContent.length;
    }

    // Store the remaining Quill segment after the last code block (if any)
    const remainingSegment = sanitizedContent.substring(lastIndex);
    quillSegments.push(remainingSegment);

    // Render Quill and SyntaxHighlighter segments based on their content
    const segments = [];
    for (let i = 0; i < quillSegments.length; i++) {
        if (quillSegments[i].trim() !== '') {
            segments.push(
                <ReactQuill
                    key={`quill_${i}`}
                    value={quillSegments[i]}
                    readOnly={true}
                    theme={null}
                />
            );
        }
        if (syntaxHighlighterSegments[i]) {
            var codeBlockMatch = codeBlockRegex.exec(sanitizedContent)
            var firstCodeBlockContent = codeBlockMatch[1];

            const languageRegex = /^(\w+)\s+/; // Matches the language name at the beginning of the code
            var languageMatch = firstCodeBlockContent.match(languageRegex);
            var languageName = "";
            var restOfTheCode = "";
            if (languageMatch) {
                languageName = languageMatch[1];
                restOfTheCode = firstCodeBlockContent.replace(languageRegex, '');
            }
            segments.push(
                <SyntaxHighlighter
                    key={`syntax_${i}`}
                    language={languageName}// Change to the appropriate language
                    style={prism}
                    wrapLines={true}
                    showLineNumbers={true}
                >
                    {restOfTheCode}
                </SyntaxHighlighter>
            );
        }
    }

    return (
        <div className={`message ${type} ${className}`}>
            {segments}
        </div>
    );
}

Message.propTypes = {
    type: PropTypes.oneOf(['user', 'bot']).isRequired,
    content: PropTypes.string.isRequired,
};

Message.defaultProps = {
    type: 'user',
    content: 'Default message content',
};

export default Message;