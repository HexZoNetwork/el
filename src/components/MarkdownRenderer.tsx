import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "motion/react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-purple max-w-none 
      prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
      prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
      prose-p:text-gray-300 prose-p:leading-relaxed
      prose-pre:bg-[#111] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
      prose-code:text-primary-purple prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
      prose-a:text-primary-purple prose-a:no-underline hover:prose-a:underline
      prose-strong:text-white
      prose-ul:text-gray-300 prose-ol:text-gray-300
      prose-li:my-2"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
