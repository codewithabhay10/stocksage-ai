import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

export async function getStockQuote(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol);
    if (!quote) return null;

    return {
      symbol: quote.symbol,
      name: quote.shortName || quote.longName || symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changesPercentage: quote.regularMarketChangePercent,
      marketCap: quote.marketCap,
      pe: quote.trailingPE || quote.forwardPE,
      eps: quote.epsTrailingTwelveMonths,
      yearHigh: quote.fiftyTwoWeekHigh,
      yearLow: quote.fiftyTwoWeekLow,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume,
      avgVolume: quote.averageDailyVolume3Month,
      exchange: quote.exchange,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
      _source: "Yahoo Finance",
      _sourceUrl: `https://finance.yahoo.com/quote/${symbol}`,
    };
  } catch (err) {
    console.error("getStockQuote error:", err.message);
    return null;
  }
}
