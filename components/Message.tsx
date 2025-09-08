
import React from 'react';

interface MessageProps {
  role: 'user' | 'model';
  content: string;
}

const formatContent = (content: string) => {
    // Basic markdown for links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = content.split(linkRegex);

    return parts.map((part, index) => {
        if (index % 3 === 1) { // This is the link text
            const url = parts[index + 1];
            return (
                <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                >
                    {part}
                </a>
            );
        }
        if (index % 3 === 2) { // This is the URL, already handled
            return null;
        }
        
        // Handle newlines
        return part.split('\n').map((line, i) => (
            <React.Fragment key={`${index}-${i}`}>
                {line}
                {i < part.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    });
};

export const Message: React.FC<MessageProps> = ({ role, content }) => {
  const isUser = role === 'user';
  const wrapperClass = isUser ? 'justify-end' : 'justify-start';
  const bubbleClass = isUser
    ? 'bg-blue-600 text-white'
    : 'bg-slate-700 text-slate-200';

  return (
    <div className={`flex ${wrapperClass} animate-fade-in-slide-up`}>
      <div className={`rounded-xl px-4 py-3 max-w-xl lg:max-w-2xl whitespace-pre-wrap shadow-md ${bubbleClass}`}>
        <p className="text-base">{formatContent(content)}</p>
      </div>
    </div>
  );
};