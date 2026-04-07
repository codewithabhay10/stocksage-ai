"use client";

import { Plus, MessageSquare } from "lucide-react";

export default function Sidebar({ isOpen, onNewChat, messages }) {
  return (
    <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">S</div>
          <span className="sidebar-logo-text">StockSage AI</span>
        </div>
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={16} />
          New Research
        </button>
      </div>

      <div className="sidebar-chats">
        <div className="sidebar-section-title">Recent</div>
        {messages.length > 0 ? (
          <div className="chat-history-item active">
            <MessageSquare size={14} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />
            {messages.find((m) => m.role === "user")?.content?.slice(0, 35) || "Current Chat"}...
          </div>
        ) : (
          <div
            style={{
              padding: "24px 12px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            No research sessions yet.
            <br />
            Start by asking about a stock!
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        Built for Vihaan 8.0 Hackathon 🚀
      </div>
    </aside>
  );
}
