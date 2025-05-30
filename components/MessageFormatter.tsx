import React from 'react';

interface MessageFormatterProps {
  message: string;
}

const MessageFormatter: React.FC<MessageFormatterProps> = ({ message }) => {
  const formatContent = (text: string) => {
    // Split text into paragraphs
    const paragraphs = text.split(/\n(?!\d+\.|\*|\-)/);
    
    return paragraphs.map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;

      // Check if this is a list block
      if (paragraph.match(/^\d+\./m)) {
        // Split into list items while preserving the content
        const items = paragraph
          .split(/\n/)
          .filter(line => line.trim())
          .map(line => line.replace(/^\d+\.\s*/, '').trim());

        return (
          <ol key={`p-${pIndex}`} className="my-3 pl-6 list-decimal">
            {items.map((item, index) => (
              <li key={`item-${index}`} className="my-1">
                {formatText(item)}
              </li>
            ))}
          </ol>
        );
      }

      // Check for bullet lists
      if (paragraph.match(/^[\*\-]/m)) {
        const items = paragraph
          .split(/\n/)
          .filter(line => line.match(/^[\*\-]/))
          .map(line => line.replace(/^[\*\-]\s*/, '').trim());

        return (
          <ul key={`p-${pIndex}`} className="my-3 pl-6 list-disc">
            {items.map((item, index) => (
              <li key={`item-${index}`} className="my-1">
                {formatText(item)}
              </li>
            ))}
          </ul>
        );
      }

      // Regular paragraph
      return (
        <p key={`p-${pIndex}`} className="my-3">
          {formatText(paragraph)}
        </p>
      );
    });
  };

  const formatText = (text: string) => {
    if (!text) return null;
    
    // Split text into segments that might contain special formatting
    const segments = [];
    let currentIndex = 0;

    // Regular expression for matching links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > currentIndex) {
        segments.push(formatBasicText(text.slice(currentIndex, match.index)));
      }

      // Add the link
      segments.push(
        <a
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {match[1]}
        </a>
      );

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      segments.push(formatBasicText(text.slice(currentIndex)));
    }

    return segments;
  };

  const formatBasicText = (text: string) => {
    return text
      .split(/(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_)/g)
      .map((segment, index) => {
        if (segment.startsWith('**') && segment.endsWith('**')) {
          return <strong key={index}>{segment.slice(2, -2)}</strong>;
        }
        if (segment.startsWith('*') && segment.endsWith('*')) {
          return <em key={index}>{segment.slice(1, -1)}</em>;
        }
        if (segment.startsWith('__') && segment.endsWith('__')) {
          return <strong key={index}>{segment.slice(2, -2)}</strong>;
        }
        if (segment.startsWith('_') && segment.endsWith('_')) {
          return <em key={index}>{segment.slice(1, -1)}</em>;
        }
        return segment;
      });
  };

  return (
    <div className="max-w-2xl space-y-2 p-4 rounded-lg bg-white">
      {formatContent(message)}
    </div>
  );
};

export default MessageFormatter;
