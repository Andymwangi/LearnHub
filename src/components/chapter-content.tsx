"use client";

import { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";

interface ChapterContentProps {
  content: string;
}

export function ChapterContent({ content }: ChapterContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState("");
  
  useEffect(() => {
    // Sanitize the HTML content to prevent XSS attacks
    const clean = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ['target', 'class', 'style'],
      ALLOWED_TAGS: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'pre', 'code', 'img', 'blockquote', 'br', 'hr'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed']
    });
    
    // Process content to add Kenya-specific context
    let processedContent = clean
      // Replace generic location references with Kenyan ones
      .replace(/New York|San Francisco|London/g, 'Nairobi')
      .replace(/California|Texas|Florida/g, 'Kenya')
      // Localize currency references
      .replace(/\$([0-9]+(\.[0-9]+)?)/g, 'KES $1')
      // Replace generic university examples with Kenyan ones
      .replace(/Stanford|Harvard|MIT/g, 'University of Nairobi')
      // Add Kenyan context to examples
      .replace(/John Smith|Jane Doe/g, 'John Kamau')
      .replace(/john\.smith@example\.com/g, 'john.kamau@gmail.com');
      
    setSanitizedContent(processedContent);
  }, [content]);

  return (
    <div 
      className="prose prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
} 