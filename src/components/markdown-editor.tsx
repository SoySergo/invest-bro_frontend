"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, List, Heading, Link as LinkIcon, Quote, ListOrdered } from 'lucide-react';
import { MarkdownViewer } from './markdown-viewer';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export function MarkdownEditor({ value, onChange, label, placeholder, className }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousValue = textarea.value;
        const selectedText = previousValue.substring(start, end);

        const activeLineStart = previousValue.lastIndexOf('\n', start - 1) + 1;
        const activeLineContent = previousValue.substring(start, end);

        let newText = "";
        let newCursorPos = start + before.length;

        // Logic for inserting/wrapping
        newText = previousValue.substring(0, start) + before + selectedText + after + previousValue.substring(end);
        newCursorPos = end + before.length;
        
        onChange(newText);
        
        // Restore focus and cursor later
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleBold = () => insertText("**", "**");
    const handleItalic = () => insertText("*", "*");
    const handleHeading = () => insertText("### ");
    const handleList = () => insertText("- ");
    const handleOrderedList = () => insertText("1. ");
    const handleQuote = () => insertText("> ");
    const handleLink = () => insertText("[", "](url)");

    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="text-sm font-medium">{label}</label>}
            <Tabs defaultValue="write" className="w-full border rounded-lg overflow-hidden bg-background">
                <div className="flex items-center justify-between px-2 py-1 border-b bg-muted/40">
                    <TabsList className="h-8 bg-transparent p-0">
                        <TabsTrigger value="write" className="h-7 px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">Write</TabsTrigger>
                        <TabsTrigger value="preview" className="h-7 px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">Preview</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center gap-1">
                        <ToolbarButton onClick={handleBold} icon={Bold} title="Bold" />
                        <ToolbarButton onClick={handleItalic} icon={Italic} title="Italic" />
                        <ToolbarButton onClick={handleHeading} icon={Heading} title="Heading" />
                        <div className="w-px h-4 bg-border mx-1" />
                        <ToolbarButton onClick={handleList} icon={List} title="List" />
                        <ToolbarButton onClick={handleOrderedList} icon={ListOrdered} title="Numbered List" />
                        <div className="w-px h-4 bg-border mx-1" />
                        <ToolbarButton onClick={handleQuote} icon={Quote} title="Quote" />
                        <ToolbarButton onClick={handleLink} icon={LinkIcon} title="Link" />
                    </div>
                </div>

                <TabsContent value="write" className="mt-0 p-0 border-none min-h-[200px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Textarea 
                        ref={textareaRef}
                        value={value} 
                        onChange={(e) => onChange(e.target.value)} 
                        placeholder={placeholder}
                        className="min-h-[300px] border-0 rounded-none focus-visible:ring-0 resize-y p-4 font-mono text-sm leading-relaxed"
                    />
                </TabsContent>
                <TabsContent value="preview" className="mt-0 p-4 min-h-[300px] bg-white dark:bg-zinc-950">
                    {value ? (
                        <MarkdownViewer content={value} />
                    ) : (
                        <div className="text-muted-foreground text-sm italic">Nothing to preview</div>
                    )}
                </TabsContent>
            </Tabs>
            <div className="flex justify-end px-2">
                 <p className="text-xs text-muted-foreground">Markdown supported</p>
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, icon: Icon, title }: { onClick: () => void; icon: any; title: string }) {
    return (
        <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 hover:bg-muted" 
            onClick={onClick}
            title={title}
        >
            <Icon className="h-3.5 w-3.5" />
        </Button>
    );
}
