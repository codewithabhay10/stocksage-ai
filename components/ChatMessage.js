"use client";

import StockCard from "./StockCard";
import StockChart from "./StockChart";
import AnalystRatings from "./AnalystRatings";
import RiskMeter from "./RiskMeter";
import NewsSummary from "./NewsSummary";
import SourceBadges from "./SourceBadges";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  // Simple text-only message (user or plain AI response)
  if (isUser || !message.data) {
    return (
      <div className={`message ${isUser ? "user" : "assistant"}`}>
        {!isUser && <div className="message-avatar ai">S</div>}
        <div className="message-content">
          <div className="message-bubble">
            {message.content}
          </div>
        </div>
        {isUser && <div className="message-avatar user">You</div>}
      </div>
    );
  }

  // Rich AI response with structured data
  const { stockData, chartData, news, analysis, analystRatings, sources } = message.data;

  return (
    <div className="message assistant">
      <div className="message-avatar ai">S</div>
      <div className="message-content">
        <div className="rich-response">
          {/* Stock Card */}
          {stockData && <StockCard data={stockData} />}

          {/* Price Chart */}
          {chartData && chartData.length > 0 && <StockChart data={chartData} />}

          {/* Analysis Overview */}
          {analysis?.overview && (
            <div className="analysis-section">
              <div className="analysis-title">🔍 Analysis Overview</div>
              <div className="analysis-text">{analysis.overview}</div>
            </div>
          )}

          {/* Bull/Bear Cases */}
          {(analysis?.bullCase || analysis?.bearCase) && (
            <div className="bull-bear-grid">
              {analysis.bullCase && (
                <div className="bull-case">
                  <div className="case-title">✅ Bull Case</div>
                  <ul className="case-points">
                    {analysis.bullCase.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.bearCase && (
                <div className="bear-case">
                  <div className="case-title">❌ Bear Case</div>
                  <ul className="case-points">
                    {analysis.bearCase.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Analyst Ratings */}
          {analystRatings && <AnalystRatings data={analystRatings} />}

          {/* Risk Meter */}
          {analysis?.riskScore && (
            <RiskMeter score={analysis.riskScore} reason={analysis.riskReason} />
          )}

          {/* News */}
          {news && news.length > 0 && <NewsSummary articles={news} />}

          {/* Verdict */}
          {analysis?.verdict && (
            <div className="analysis-section">
              <div className="analysis-title">📋 Verdict</div>
              <div className="analysis-text">{analysis.verdict}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 12,
                  fontStyle: "italic",
                }}
              >
                ⚠️ This is AI-generated analysis from public data sources. This is not financial advice.
                Always do your own research before making investment decisions.
              </div>
            </div>
          )}

          {/* Source Citations */}
          {sources && sources.length > 0 && <SourceBadges sources={sources} />}
        </div>
      </div>
    </div>
  );
}
