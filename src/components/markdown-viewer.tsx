"use client";

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { ClassNameValue } from 'tailwind-merge';

interface MarkdownViewerProps {
    content: string;
    className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
    return (
        <article className={cn("prose prose-stone dark:prose-invert max-w-none prose-headlines:font-bold prose-h1:text-2xl prose-h2:text-xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline", className)}>
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </article>
    );
}
