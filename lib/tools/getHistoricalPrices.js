import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

export async function getHistoricalPrices(symbol) {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    const result = await yahooFinance.chart(symbol, {
      period1: startDate.toISOString().split("T")[0],
      period2: endDate.toISOString().split("T")[0],
      interval: "1d",
    });

    if (!result?.quotes || result.quotes.length === 0) return [];

    return result.quotes
      .filter((d) => d.close !== null)
      .map((d) => ({
        date: new Date(d.date).toISOString().split("T")[0],
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
      }));
  } catch (err) {
    console.error("getHistoricalPrices error:", err.message);
    return [];
  }
}
