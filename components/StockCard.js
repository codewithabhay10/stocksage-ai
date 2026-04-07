"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

export default function StockCard({ data }) {
  if (!data) return null;

  const isPositive = (data.change || 0) >= 0;

  const formatNumber = (num) => {
    if (!num && num !== 0) return "N/A";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="stock-card">
      <div className="stock-card-header">
        <div className="stock-card-info">
          <div className="stock-card-name">{data.name || data.symbol}</div>
          <div className="stock-card-ticker">
            {data.symbol}
            <span className="exchange-badge">{data.exchange || "NSE"}</span>
          </div>
        </div>
        <div className="stock-card-price">
          <div className="stock-price" style={{ color: isPositive ? "var(--accent-green)" : "var(--accent-red)" }}>
            ₹{data.price?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "—"}
          </div>
          <div className={`stock-change ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? "+" : ""}
            {data.change?.toFixed(2) || 0} ({data.changesPercentage?.toFixed(2) || 0}%)
          </div>
        </div>
      </div>

      <div className="stock-metrics">
        <div className="metric-item">
          <span className="metric-label">Market Cap</span>
          <span className="metric-value">{formatNumber(data.marketCap)}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">P/E Ratio</span>
          <span className="metric-value">{data.pe?.toFixed(2) || "N/A"}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">EPS</span>
          <span className="metric-value">₹{data.eps?.toFixed(2) || "N/A"}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">52W Range</span>
          <span className="metric-value" style={{ fontSize: 12 }}>
            ₹{data.yearLow?.toLocaleString("en-IN") || "—"} - ₹{data.yearHigh?.toLocaleString("en-IN") || "—"}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Day High</span>
          <span className="metric-value">₹{data.dayHigh?.toLocaleString("en-IN") || "—"}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Day Low</span>
          <span className="metric-value">₹{data.dayLow?.toLocaleString("en-IN") || "—"}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Volume</span>
          <span className="metric-value">
            {data.volume ? (data.volume / 1000000).toFixed(2) + "M" : "N/A"}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Avg Volume</span>
          <span className="metric-value">
            {data.avgVolume ? (data.avgVolume / 1000000).toFixed(2) + "M" : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
