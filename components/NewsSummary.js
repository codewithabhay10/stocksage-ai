"use client";

import { ExternalLink } from "lucide-react";

export default function NewsSummary({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="news-summary">
      <div className="analysis-title">📰 Recent News (Trusted Sources)</div>

      <div className="news-list">
        {articles.map((article, i) => (
          <a
            key={i}
            className="news-item"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="news-item-title">
              {article.title}
              <ExternalLink
                size={12}
                style={{
                  display: "inline",
                  marginLeft: 6,
                  verticalAlign: "middle",
                  opacity: 0.5,
                }}
              />
            </div>
            <div className="news-item-meta">
              <span className="news-source-badge">{article.source || "News"}</span>
              {article.date && <span>{article.date}</span>}
            </div>
            {article.summary && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 4,
                  lineHeight: 1.5,
                }}
              >
                {article.summary.slice(0, 150)}
                {article.summary.length > 150 ? "..." : ""}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
