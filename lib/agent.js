import { getStockQuote } from "./tools/getStockQuote";
import { getFinancials } from "./tools/getFinancials";
import { getAnalystRatings } from "./tools/getAnalystRatings";
import { searchNews } from "./tools/searchNews";
import { getCompanyProfile } from "./tools/getCompanyProfile";
import { getHistoricalPrices } from "./tools/getHistoricalPrices";
import { SYSTEM_PROMPT } from "./prompts";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1";

// Map common Indian stock names to tickers
const TICKER_MAP = {
  reliance: "RELIANCE.NS",
  "reliance industries": "RELIANCE.NS",
  tcs: "TCS.NS",
  "tata consultancy": "TCS.NS",
  infosys: "INFY.NS",
  infy: "INFY.NS",
  "hdfc bank": "HDFCBANK.NS",
  hdfc: "HDFCBANK.NS",
  "icici bank": "ICICIBANK.NS",
  icici: "ICICIBANK.NS",
  "bharti airtel": "BHARTIARTL.NS",
  airtel: "BHARTIARTL.NS",
  wipro: "WIPRO.NS",
  itc: "ITC.NS",
  sbi: "SBIN.NS",
  "state bank": "SBIN.NS",
  "tata motors": "TATAMOTORS.NS",
  "tata steel": "TATASTEEL.NS",
  "l&t": "LT.NS",
  larsen: "LT.NS",
  hul: "HINDUNILVR.NS",
  "hindustan unilever": "HINDUNILVR.NS",
  maruti: "MARUTI.NS",
  "bajaj finance": "BAJFINANCE.NS",
  "kotak bank": "KOTAKBANK.NS",
  "kotak mahindra": "KOTAKBANK.NS",
  "asian paints": "ASIANPAINT.NS",
  "sun pharma": "SUNPHARMA.NS",
  sunpharma: "SUNPHARMA.NS",
  adani: "ADANIENT.NS",
  "adani enterprises": "ADANIENT.NS",
  "adani ports": "ADANIPORTS.NS",
  "power grid": "POWERGRID.NS",
  "axis bank": "AXISBANK.NS",
  "bajaj finserv": "BAJAJFINSV.NS",
  "tech mahindra": "TECHM.NS",
  "ultra cement": "ULTRACEMCO.NS",
  "ultratech cement": "ULTRACEMCO.NS",
  "nestle india": "NESTLEIND.NS",
  nestle: "NESTLEIND.NS",
  "titan": "TITAN.NS",
  "indusind bank": "INDUSINDBK.NS",
};

/**
 * Extract stock ticker(s) from user query
 */
function extractTickers(query) {
  const lower = query.toLowerCase();
  const tickers = [];

  // Check for known names (longest match first)
  const sortedNames = Object.keys(TICKER_MAP).sort((a, b) => b.length - a.length);
  for (const name of sortedNames) {
    if (lower.includes(name)) {
      const ticker = TICKER_MAP[name];
      if (!tickers.includes(ticker)) {
        tickers.push(ticker);
      }
    }
  }

  // Check for direct ticker format (e.g., RELIANCE.NS)
  const tickerRegex = /\b([A-Z]{2,20})(\.NS|\.BO)?\b/g;
  let match;
  while ((match = tickerRegex.exec(query)) !== null) {
    const candidate = match[1] + (match[2] || ".NS");
    if (!tickers.includes(candidate) && match[1].length >= 3) {
      tickers.push(candidate);
    }
  }

  return tickers;
}

/**
 * Call Ollama's API
 */
async function callOllama(prompt, system = SYSTEM_PROMPT) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 2048,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Ollama error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.message?.content || "";
}

/**
 * Run the agent:
 * 1. Extract tickers from user query
 * 2. Fetch all data in parallel
 * 3. Send data + query to local LLM for analysis
 */
export async function runAgent(userMessage, history = [], onThinking) {
  console.log(`[StockSage] Using Ollama model: ${OLLAMA_MODEL} at ${OLLAMA_URL}`);

  // Step 1: Extract tickers
  if (onThinking) onThinking("Identifying stock ticker...");
  const tickers = extractTickers(userMessage);
  const ticker = tickers[0]; // primary ticker

  if (!ticker) {
    // No stock found — just do a general chat with the LLM
    if (onThinking) onThinking("Thinking...");
    const response = await callOllama(
      `User question: ${userMessage}\n\nRespond helpfully about Indian stocks. If they're asking about a specific stock, tell them to mention the stock name clearly. Respond in JSON format: {"analysis": {"overview": "your response", "bullCase": [], "bearCase": [], "riskScore": null, "riskReason": "", "verdict": ""}}`
    );

    let analysis;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysis = parsed.analysis || parsed;
      } else {
        analysis = { overview: response, bullCase: [], bearCase: [], riskScore: null, riskReason: "", verdict: "" };
      }
    } catch {
      analysis = { overview: response, bullCase: [], bearCase: [], riskScore: null, riskReason: "", verdict: "" };
    }

    return { stockData: null, chartData: [], news: [], analystRatings: null, financials: null, profile: null, analysis, sources: [] };
  }

  console.log(`[StockSage] Detected ticker: ${ticker}`);

  // Step 2: Fetch all data in parallel
  if (onThinking) onThinking("Fetching live stock quote...");

  const [stockData, profile, financials, analystRatings, chartData, news] = await Promise.all([
    getStockQuote(ticker).catch((e) => { console.error("Quote error:", e); return null; }),
    getCompanyProfile(ticker).catch((e) => { console.error("Profile error:", e); return null; }),
    getFinancials(ticker).catch((e) => { console.error("Financials error:", e); return null; }),
    getAnalystRatings(ticker).catch((e) => { console.error("Ratings error:", e); return null; }),
    getHistoricalPrices(ticker).catch((e) => { console.error("History error:", e); return []; }),
    searchNews(ticker.replace(".NS", "").replace(".BO", "") + " stock India").catch((e) => { console.error("News error:", e); return []; }),
  ]);

  if (onThinking) onThinking("Pulling financial statements...");
  if (onThinking) onThinking("Searching trusted financial news...");
  if (onThinking) onThinking("Getting analyst consensus...");

  // Attach current price to analyst ratings for upside calculation
  if (analystRatings && stockData) {
    analystRatings.currentPrice = stockData.price;
  }

  // Build sources list
  const sources = [];
  if (stockData) sources.push({ name: "Yahoo Finance", url: `https://finance.yahoo.com/quote/${ticker}`, type: "financial" });
  if (analystRatings) sources.push({ name: "Analyst Ratings", url: `https://finance.yahoo.com/quote/${ticker}/analysis`, type: "analyst" });
  if (news && news.length > 0) {
    news.forEach((n) => {
      if (!sources.find((s) => s.name === n.source)) {
        sources.push({ name: n.source, url: n.url, type: "news" });
      }
    });
  }

  // Step 3: Build data context for LLM
  if (onThinking) onThinking("Synthesizing analysis...");

  const dataContext = `
## STOCK DATA FOR: ${ticker}

### Current Quote:
${stockData ? JSON.stringify(stockData, null, 2) : "No data available"}

### Company Profile:
${profile ? JSON.stringify(profile, null, 2) : "No data available"}

### Financial Statements:
${financials ? JSON.stringify(financials, null, 2) : "No data available"}

### Analyst Ratings:
${analystRatings ? JSON.stringify(analystRatings, null, 2) : "No data available"}

### Recent News Headlines:
${news && news.length > 0 ? news.map((n) => `- ${n.title} (${n.source})`).join("\n") : "No recent news found"}
`;

  const analysisPrompt = `${dataContext}

## USER QUESTION: ${userMessage}

Based on ALL the above real data, provide a comprehensive analysis. You MUST respond with valid JSON in this exact format (no extra text outside the JSON):
{
  "analysis": {
    "overview": "2-3 sentence summary using actual numbers from the data above",
    "bullCase": ["specific positive point 1 with numbers", "point 2", "point 3"],
    "bearCase": ["specific risk/concern 1 with numbers", "point 2", "point 3"],
    "riskScore": <number 1-10>,
    "riskReason": "Brief explanation referencing actual metrics",
    "verdict": "Overall assessment — buy/hold/sell context with reasoning"
  }
}`;

  const llmResponse = await callOllama(analysisPrompt);

  // Parse LLM response
  let analysis;
  try {
    const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      analysis = parsed.analysis || parsed;
    } else {
      analysis = { overview: llmResponse, bullCase: [], bearCase: [], riskScore: null, riskReason: "", verdict: "" };
    }
  } catch {
    analysis = { overview: llmResponse, bullCase: [], bearCase: [], riskScore: null, riskReason: "", verdict: "" };
  }

  return {
    stockData,
    chartData,
    news,
    analystRatings,
    financials,
    profile,
    analysis,
    sources,
  };
}
