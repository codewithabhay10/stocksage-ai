"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="input-area">
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Ask about any Indian stock... e.g. 'Analyze Reliance Industries'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={disabled || !text.trim()}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="input-disclaimer">
          StockSage uses authoritative data from FMP, NSE & trusted news. Not financial advice.
        </div>
      </div>
    </div>
  );
}
