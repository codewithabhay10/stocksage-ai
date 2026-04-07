import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

export async function getCompanyProfile(symbol) {
  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ["summaryProfile", "assetProfile"],
    });

    const profile = result.assetProfile || result.summaryProfile || {};
    const quote = await yahooFinance.quote(symbol);

    return {
      name: quote?.shortName || quote?.longName || symbol,
      symbol: symbol,
      exchange: quote?.exchange || "NSE",
      sector: profile.sector || "N/A",
      industry: profile.industry || "N/A",
      description: (profile.longBusinessSummary || "").slice(0, 500),
      website: profile.website || "",
      employees: profile.fullTimeEmployees || null,
      country: profile.country || "India",
      _source: "Yahoo Finance",
      _sourceUrl: `https://finance.yahoo.com/quote/${symbol}/profile`,
    };
  } catch (err) {
    console.error("getCompanyProfile error:", err.message);
    return null;
  }
}
