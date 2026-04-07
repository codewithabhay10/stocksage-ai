"use client";

export default function AnalystRatings({ data }) {
  if (!data) return null;

  const { buy = 0, hold = 0, sell = 0, targetPrice, currentPrice } = data;
  const total = buy + hold + sell;
  if (total === 0) return null;

  const buyPct = (buy / total) * 100;
  const holdPct = (hold / total) * 100;
  const sellPct = (sell / total) * 100;

  const upside = targetPrice && currentPrice
    ? (((targetPrice - currentPrice) / currentPrice) * 100).toFixed(1)
    : null;

  return (
    <div className="analyst-ratings">
      <div className="analysis-title">
        🎯 Analyst Consensus
      </div>

      <div className="ratings-bar-container">
        <div className="ratings-bar">
          {buyPct > 0 && (
            <div
              className="ratings-bar-segment buy"
              style={{ width: `${buyPct}%` }}
            >
              {buy}
            </div>
          )}
          {holdPct > 0 && (
            <div
              className="ratings-bar-segment hold"
              style={{ width: `${holdPct}%` }}
            >
              {hold}
            </div>
          )}
          {sellPct > 0 && (
            <div
              className="ratings-bar-segment sell"
              style={{ width: `${sellPct}%` }}
            >
              {sell}
            </div>
          )}
        </div>

        <div className="ratings-labels">
          <span className="ratings-label">
            <span className="ratings-dot buy"></span>
            Buy ({buy})
          </span>
          <span className="ratings-label">
            <span className="ratings-dot hold"></span>
            Hold ({hold})
          </span>
          <span className="ratings-label">
            <span className="ratings-dot sell"></span>
            Sell ({sell})
          </span>
        </div>
      </div>

      {targetPrice && (
        <div className="target-price">
          <span className="target-price-label">Consensus Target Price</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="target-price-value">
              ₹{targetPrice.toLocaleString("en-IN")}
            </span>
            {upside && (
              <span
                className="target-price-upside"
                style={{
                  color: parseFloat(upside) >= 0 ? "var(--accent-green)" : "var(--accent-red)",
                }}
              >
                {parseFloat(upside) >= 0 ? "↑" : "↓"} {Math.abs(parseFloat(upside))}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
