"use client";

import { Check, Loader2, Circle } from "lucide-react";

export default function ThinkingPanel({ steps }) {
  const allSteps = [
    "Identifying stock ticker...",
    "Fetching live stock quote...",
    "Pulling financial statements...",
    "Searching trusted financial news...",
    "Getting analyst consensus...",
    "Synthesizing analysis...",
  ];

  return (
    <div className="thinking-panel">
      <div className="thinking-title">🧠 Researching...</div>
      <div className="thinking-steps">
        {steps.map((step, i) => (
          <div key={i} className="thinking-step" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="thinking-step-icon done">
              <Check size={14} />
            </span>
            {step}
          </div>
        ))}
        {steps.length < allSteps.length && (
          <div className="thinking-step">
            <span className="thinking-step-icon loading">
              <Loader2 size={14} />
            </span>
            {allSteps[steps.length] || "Processing..."}
          </div>
        )}
      </div>
    </div>
  );
}
