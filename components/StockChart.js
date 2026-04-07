"use client";

import { useEffect, useRef, useState } from "react";

export default function StockChart({ data }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [timeframe, setTimeframe] = useState("1Y");

  useEffect(() => {
    if (!data || data.length === 0 || !chartContainerRef.current) return;

    let chart;
    const initChart = async () => {
      const { createChart } = await import("lightweight-charts");

      // Clear previous chart
      if (chartRef.current) {
        chartRef.current.remove();
      }

      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: "transparent" },
          textColor: "#8b8da3",
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
        },
        grid: {
          vertLines: { color: "rgba(255,255,255,0.03)" },
          horzLines: { color: "rgba(255,255,255,0.03)" },
        },
        crosshair: {
          mode: 0,
          vertLine: { color: "rgba(124,106,239,0.3)", width: 1 },
          horzLine: { color: "rgba(124,106,239,0.3)", width: 1 },
        },
        rightPriceScale: {
          borderColor: "rgba(255,255,255,0.06)",
        },
        timeScale: {
          borderColor: "rgba(255,255,255,0.06)",
          timeVisible: false,
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
      });

      const areaSeries = chart.addSeries(chart.addAreaSeries ? undefined : undefined);
      const series = chart.addAreaSeries({
        topColor: "rgba(124, 106, 239, 0.3)",
        bottomColor: "rgba(124, 106, 239, 0.02)",
        lineColor: "#7c6aef",
        lineWidth: 2,
      });

      // Filter by timeframe
      const now = new Date();
      let daysBack = 365;
      if (timeframe === "1M") daysBack = 30;
      else if (timeframe === "3M") daysBack = 90;
      else if (timeframe === "6M") daysBack = 180;

      const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

      const filteredData = data
        .filter((d) => new Date(d.date) >= cutoff)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((d) => ({
          time: d.date,
          value: d.close || d.price,
        }));

      series.setData(filteredData);
      chart.timeScale().fitContent();
      chartRef.current = chart;
    };

    initChart();

    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart) chart.remove();
    };
  }, [data, timeframe]);

  if (!data || data.length === 0) return null;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <span className="chart-title">📈 Price History</span>
        <div className="chart-timeframes">
          {["1M", "3M", "6M", "1Y"].map((tf) => (
            <button
              key={tf}
              className={`chart-tf-btn ${timeframe === tf ? "active" : ""}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-wrapper" ref={chartContainerRef} />
    </div>
  );
}
