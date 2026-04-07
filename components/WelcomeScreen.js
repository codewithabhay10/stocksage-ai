"use client";

import { TrendingUp, BarChart3, Newspaper, GitCompareArrows } from "lucide-react";

const suggestions = [
  {
    icon: <TrendingUp size={20} />,
    text: "Analyze Reliance Industries",
    desc: "Get complete stock analysis with financials & news",
  },
  {
    icon: <GitCompareArrows size={20} />,
    text: "Compare TCS vs Infosys",
    desc: "Head-to-head comparison of IT giants",
  },
  {
    icon: <BarChart3 size={20} />,
    text: "Is HDFC Bank a good investment?",
    desc: "Deep dive with analyst consensus & risk score",
  },
  {
    icon: <Newspaper size={20} />,
    text: "Latest news on Tata Motors",
    desc: "Recent developments from trusted sources",
  },
];

export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-icon">
        <TrendingUp size={36} color="white" />
      </div>
      <h1 className="welcome-title">StockSage AI</h1>
      <p className="welcome-subtitle">
        Your AI-powered stock research analyst. Ask about any Indian stock and get
        comprehensive analysis with data from trusted, authoritative sources —
        every claim backed by verifiable citations.
      </p>

      <div className="suggested-queries">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="suggested-query"
            onClick={() => onSuggestionClick(s.text)}
          >
            <span className="suggested-query-icon">{s.icon}</span>
            <span className="suggested-query-text">{s.text}</span>
            <span className="suggested-query-desc">{s.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
