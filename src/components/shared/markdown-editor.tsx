"use client";

import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Bold, Italic, Strikethrough, List, Heading1, Heading2, Heading3,
    Link as LinkIcon, Quote, ListOrdered, Code, Minus, Table, Eye, EyeOff
} from 'lucide-react';
import { MarkdownViewer } from './markdown-viewer';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export function MarkdownEditor({ value, onChange, label, placeholder, className }: MarkdownEditorProps) {
    const t = useTranslations("MarkdownEditor");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showPreview, setShowPreview] = useState(false);

    const insertText = useCallback((before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousValue = textarea.value;
        const selectedText = previousValue.substring(start, end);

        const newText = previousValue.substring(0, start) + before + selectedText + after + previousValue.substring(end);
        const newCursorPos = end + before.length;

        onChange(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [onChange]);

    const insertLinePrefix = useCallback((prefix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const previousValue = textarea.value;
        const lineStart = previousValue.lastIndexOf('\n', start - 1) + 1;

        const newText = previousValue.substring(0, lineStart) + prefix + previousValue.substring(lineStart);
        const newCursorPos = start + prefix.length;

        onChange(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [onChange]);

    const handleBold = () => insertText("**", "**");
    const handleItalic = () => insertText("*", "*");
    const handleStrikethrough = () => insertText("~~", "~~");
    const handleH1 = () => insertLinePrefix("# ");
    const handleH2 = () => insertLinePrefix("## ");
    const handleH3 = () => insertLinePrefix("### ");
    const handleList = () => insertLinePrefix("- ");
    const handleOrderedList = () => insertLinePrefix("1. ");
    const handleQuote = () => insertLinePrefix("> ");
    const handleCode = () => insertText("`", "`");
    const handleLink = () => insertText("[", "](url)");
    const handleHorizontalRule = () => insertText("\n---\n");
    const handleTable = () => insertText("\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| ", " | | |\n");

    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="text-sm font-medium">{label}</label>}
            <div className="w-full border rounded-lg overflow-hidden bg-background">
                <div className="flex items-center justify-between px-2 py-1 border-b bg-surface-2/40">
                    <div className="flex items-center gap-1 flex-wrap">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-muted" title={t("heading")}>
                                    H
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={handleH1}>
                                    <Heading1 className="h-4 w-4 mr-2" />
                                    {t("heading1")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleH2}>
                                    <Heading2 className="h-4 w-4 mr-2" />
                                    {t("heading2")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleH3}>
                                    <Heading3 className="h-4 w-4 mr-2" />
                                    {t("heading3")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div className="w-px h-4 bg-border mx-0.5" />
                        <ToolbarButton onClick={handleBold} icon={Bold} title={t("bold")} />
                        <ToolbarButton onClick={handleItalic} icon={Italic} title={t("italic")} />
                        <ToolbarButton onClick={handleStrikethrough} icon={Strikethrough} title={t("strikethrough")} />
                        <div className="w-px h-4 bg-border mx-0.5" />
                        <ToolbarButton onClick={handleList} icon={List} title={t("bulletList")} />
                        <ToolbarButton onClick={handleOrderedList} icon={ListOrdered} title={t("numberedList")} />
                        <div className="w-px h-4 bg-border mx-0.5" />
                        <ToolbarButton onClick={handleQuote} icon={Quote} title={t("quote")} />
                        <ToolbarButton onClick={handleCode} icon={Code} title={t("inlineCode")} />
                        <ToolbarButton onClick={handleLink} icon={LinkIcon} title={t("link")} />
                        <div className="w-px h-4 bg-border mx-0.5" />
                        <ToolbarButton onClick={handleHorizontalRule} icon={Minus} title={t("horizontalRule")} />
                        <ToolbarButton onClick={handleTable} icon={Table} title={t("table")} />
                    </div>

                    <Button
                        type="button"
                        variant={showPreview ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 px-2 text-xs gap-1"
                        onClick={() => setShowPreview(!showPreview)}
                        title={showPreview ? t("hidePreview") : t("showPreview")}
                    >
                        {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span className="hidden sm:inline">{t("preview")}</span>
                    </Button>
                </div>

                {showPreview ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border">
                        <div className="min-h-75">
                            <Textarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder}
                                className="min-h-75 border-0 rounded-none focus-visible:ring-0 resize-y p-4 font-mono text-sm leading-relaxed"
                            />
                        </div>
                        <div className="p-4 min-h-75 bg-surface-2/30 overflow-auto">
                            {value ? (
                                <MarkdownViewer content={value} />
                            ) : (
                                <div className="text-muted-foreground text-sm italic">{t("nothingToPreview")}</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <Textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="min-h-75 border-0 rounded-none focus-visible:ring-0 resize-y p-4 font-mono text-sm leading-relaxed"
                    />
                )}
            </div>
            <div className="flex justify-end px-2">
                <p className="text-xs text-muted-foreground">{t("markdownSupported")}</p>
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, icon: Icon, title }: { onClick: () => void; icon: React.ComponentType<{ className?: string }>; title: string }) {
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
