import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

export async function getAnalystRatings(symbol) {
  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ["recommendationTrend", "financialData"],
    });

    const trends = result.recommendationTrend?.trend || [];
    const fin = result.financialData || {};

    // Get the most recent recommendation period
    const current = trends[0] || {};

    const buy = (current.strongBuy || 0) + (current.buy || 0);
    const hold = current.hold || 0;
    const sell = (current.sell || 0) + (current.strongSell || 0);

    return {
      buy,
      hold,
      sell,
      targetPrice: fin.targetMeanPrice || fin.targetMedianPrice || null,
      targetHigh: fin.targetHighPrice || null,
      targetLow: fin.targetLowPrice || null,
      recommendation: fin.recommendationKey || null,
      numberOfAnalysts: fin.numberOfAnalystOpinions || null,
      _source: "Yahoo Finance Analyst Consensus",
      _sourceUrl: `https://finance.yahoo.com/quote/${symbol}/analysis`,
    };
  } catch (err) {
    console.error("getAnalystRatings error:", err.message);
    return null;
  }
}
