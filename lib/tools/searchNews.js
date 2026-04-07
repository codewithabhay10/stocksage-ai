const TAVILY_KEY = process.env.TAVILY_API_KEY;

export async function searchNews(query) {
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_KEY,
        query: `${query} stock market news analysis`,
        search_depth: "basic",
        include_domains: [
          "economictimes.indiatimes.com",
          "moneycontrol.com",
          "livemint.com",
          "reuters.com",
          "bloomberg.com",
          "cnbc.com",
          "ndtvprofit.com",
          "bseindia.com",
          "nseindia.com",
          "business-standard.com",
          "financialexpress.com",
        ],
        max_results: 5,
      }),
    });

    if (!res.ok) throw new Error(`Tavily error: ${res.status}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) return [];

    return data.results.map((r) => {
      // Extract source/domain name
      let source = "News";
      try {
        const hostname = new URL(r.url).hostname.replace("www.", "");
        const domainMap = {
          "economictimes.indiatimes.com": "Economic Times",
          "moneycontrol.com": "MoneyControl",
          "livemint.com": "LiveMint",
          "reuters.com": "Reuters",
          "bloomberg.com": "Bloomberg",
          "cnbc.com": "CNBC",
          "ndtvprofit.com": "NDTV Profit",
          "bseindia.com": "BSE India",
          "nseindia.com": "NSE India",
          "business-standard.com": "Business Standard",
          "financialexpress.com": "Financial Express",
        };
        source = domainMap[hostname] || hostname;
      } catch (e) {}

      return {
        title: r.title,
        url: r.url,
        summary: r.content?.slice(0, 200) || "",
        source,
        date: r.published_date || "",
        _source: source,
        _sourceUrl: r.url,
      };
    });
  } catch (err) {
    console.error("searchNews error:", err.message);
    return [];
  }
}
