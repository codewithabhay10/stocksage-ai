import "./globals.css";

export const metadata = {
  title: "StockSage AI — AI-Powered Stock Research",
  description:
    "Research Indian stocks with AI. Get comprehensive analysis with trusted data sources, analyst ratings, and transparent reasoning.",
  keywords: "stock research, AI, Indian stocks, NSE, BSE, financial analysis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
