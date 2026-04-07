"use client";

export default function RiskMeter({ score, reason }) {
  if (!score && score !== 0) return null;

  const getColor = (s) => {
    if (s <= 3) return "var(--accent-green)";
    if (s <= 5) return "var(--accent-amber)";
    if (s <= 7) return "var(--accent-red)";
    return "#ff3333";
  };

  const getLabel = (s) => {
    if (s <= 2) return "Low Risk";
    if (s <= 4) return "Low-Moderate";
    if (s <= 6) return "Moderate";
    if (s <= 8) return "High";
    return "Very High";
  };

  const color = getColor(score);
  const label = getLabel(score);

  // Needle rotation: 0 = left (low), 180 = right (high)
  const rotation = (score / 10) * 180;

  return (
    <div className="risk-meter">
      <div className="analysis-title">⚠️ Risk Assessment</div>

      <div className="risk-gauge">
        <div className="risk-gauge-bg">
          <div className="risk-gauge-inner"></div>
        </div>
        {/* Needle */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            width: 2,
            height: 50,
            background: color,
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${rotation - 90}deg)`,
            borderRadius: 2,
            transition: "transform 0.8s ease",
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>

      <div className="risk-score-value" style={{ color }}>
        {score}/10
      </div>
      <div className="risk-score-label" style={{ color }}>
        {label}
      </div>
      {reason && <div className="risk-explanation">{reason}</div>}
    </div>
  );
}
