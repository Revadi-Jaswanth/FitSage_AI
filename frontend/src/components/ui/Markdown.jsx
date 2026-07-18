import React from "react";
import "./ui.css";

export default function Markdown({ content = "" }) {
    if (!content) return null;
    
    // Split content by newline to parse blocks
    const lines = content.split("\n");
    let currentList = [];
    const elements = [];
    
    const flushList = (key) => {
        if (currentList.length > 0) {
            elements.push(<ul key={`ul-${key}`} className="md-list">{currentList}</ul>);
            currentList = [];
        }
    };
    
    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        
        // 1. Headers: ### Title or DAY X - ...
        if (trimmed.startsWith("###")) {
            flushList(idx);
            elements.push(<h4 key={idx} className="md-h4">{trimmed.replace(/^###\s*/, "")}</h4>);
        }
        else if (trimmed.startsWith("DAY") && (trimmed.includes(" - ") || trimmed.includes("DAY "))) {
            flushList(idx);
            elements.push(<h3 key={idx} className="md-h3">{trimmed}</h3>);
        }
        // 2. Bold sections (e.g. Shopping List:, Tips:)
        else if (trimmed.endsWith(":") && (trimmed.startsWith("Shopping") || trimmed.startsWith("Tips") || trimmed.startsWith("Warnings") || trimmed.startsWith("Motivation") || trimmed.startsWith("Suggested"))) {
            flushList(idx);
            elements.push(<h5 key={idx} className="md-h5">{trimmed}</h5>);
        }
        // 3. Lists: - Item or * Item
        else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            const listText = trimmed.replace(/^[-*]\s*/, "");
            currentList.push(<li key={`li-${idx}`}>{listText}</li>);
        }
        // 4. Regular Text paragraphs
        else if (trimmed) {
            flushList(idx);
            elements.push(<p key={idx} className="md-p">{trimmed}</p>);
        } else {
            // Empty line
            flushList(idx);
        }
    });
    
    flushList("end");
    
    return <div className="markdown-render">{elements}</div>;
}
