"use client";

import { PanelLeftClose, PanelLeft, Zap } from "lucide-react";

export default function Header({ onToggleSidebar, hasMessages }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <PanelLeft size={18} />
        </button>
        <span className="header-title">
          {hasMessages ? "Research Session" : "StockSage AI"}
        </span>
      </div>

      <div className="header-right">
        <div className="header-badge">
          <Zap size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
          NSE / BSE
        </div>
      </div>
    </header>
  );
}
