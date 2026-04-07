"use client";

export default function SourceBadges({ sources }) {
  if (!sources || sources.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "financial": return "📊";
      case "news": return "📰";
      case "analyst": return "🎯";
      case "profile": return "🏢";
      default: return "🔗";
    }
  };

  return (
    <div className="source-badges">
      <span style={{ fontSize: 11, color: "var(--text-muted)", marginRight: 4 }}>
        Sources:
      </span>
      {sources.map((source, i) => (
        <a
          key={i}
          className="source-badge"
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Data from ${source.name}`}
        >
          <span className="source-badge-icon">{getIcon(source.type)}</span>
          {source.name}
        </a>
      ))}
    </div>
  );
}
