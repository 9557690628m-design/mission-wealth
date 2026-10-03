"use client";

import React, { useEffect, useRef, memo } from "react";

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => unknown;
    };
  }
}

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const containerId = useRef(
    `tradingview_${Math.random().toString(36).slice(2, 10)}`
  );

  useEffect(() => {
    const rawSymbol = (symbol || "TCS").trim().toUpperCase();
    const formattedSymbol = rawSymbol.includes(":")
      ? rawSymbol
      : `NSE:${rawSymbol}`;

    const renderChart = () => {
      const container = document.getElementById(containerId.current);
      if (!container || !window.TradingView) return;

      container.innerHTML = "";

      new window.TradingView.widget({
        autosize: true,
        symbol: formattedSymbol,
        interval: "D",
        timezone: "Asia/Kolkata",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId.current,
      });
    };

    if (window.TradingView) {
      renderChart();
    } else {
      const existingScript = document.getElementById("tradingview-tv-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "tradingview-tv-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.async = true;
        script.onload = renderChart;
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", renderChart);
      }
    }
  }, [symbol]);

  return (
    <div className="w-full h-[540px] rounded-2xl border border-white/10 bg-[#06101d] p-1 overflow-hidden">
      <div id={containerId.current} className="w-full h-full" />
    </div>
  );
}

export default memo(TradingViewWidget);
