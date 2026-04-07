import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

export async function getFinancials(symbol) {
  try {
    const result = await yahooFinance.quoteSummary(symbol, {
      modules: ["financialData", "defaultKeyStatistics", "incomeStatementHistory"],
    });

    const fin = result.financialData || {};
    const stats = result.defaultKeyStatistics || {};
    const incomeHistory = result.incomeStatementHistory?.incomeStatementHistory || [];
    const latest = incomeHistory[0] || {};
    const prev = incomeHistory[1] || {};

    const revenueGrowth =
      latest.totalRevenue && prev.totalRevenue
        ? (((latest.totalRevenue - prev.totalRevenue) / prev.totalRevenue) * 100).toFixed(1)
        : null;

    const profitGrowth =
      latest.netIncome && prev.netIncome
        ? (((latest.netIncome - prev.netIncome) / prev.netIncome) * 100).toFixed(1)
        : null;

    return {
      revenue: fin.totalRevenue || latest.totalRevenue || null,
      netIncome: latest.netIncome || null,
      grossProfit: latest.grossProfit || null,
      ebitda: fin.ebitda || null,
      revenueGrowthYoY: revenueGrowth ? `${revenueGrowth}%` : "N/A",
      profitGrowthYoY: profitGrowth ? `${profitGrowth}%` : "N/A",
      grossProfitMargin: fin.grossMargins
        ? `${(fin.grossMargins * 100).toFixed(1)}%`
        : "N/A",
      netProfitMargin: fin.profitMargins
        ? `${(fin.profitMargins * 100).toFixed(1)}%`
        : "N/A",
      returnOnEquity: fin.returnOnEquity
        ? `${(fin.returnOnEquity * 100).toFixed(1)}%`
        : "N/A",
      debtEquityRatio: fin.debtToEquity
        ? (fin.debtToEquity / 100).toFixed(2)
        : (stats.debtToEquity ? stats.debtToEquity.toFixed(2) : "N/A"),
      currentRatio: fin.currentRatio
        ? fin.currentRatio.toFixed(2)
        : "N/A",
      revenuePerShare: fin.revenuePerShare || null,
      _source: "Yahoo Finance (Official Filings)",
      _sourceUrl: `https://finance.yahoo.com/quote/${symbol}/financials`,
    };
  } catch (err) {
    console.error("getFinancials error:", err.message);
    return null;
  }
}
