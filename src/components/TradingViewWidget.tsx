"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset container contents when symbol changes
    container.innerHTML = "";

    // 1. Create inner widget placeholder expected by TradingView's loader
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = "100%";
    widgetDiv.style.width = "100%";
    container.appendChild(widgetDiv);

    // 2. Format ticker for Indian market (NSE)
    const rawSymbol = (symbol || "TCS").trim().toUpperCase();
    const formattedSymbol = rawSymbol.includes(":")
      ? rawSymbol
      : `NSE:${rawSymbol}`;

    // 3. Inject TradingView Advanced Chart script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const config = {
      autosize: true,
      symbol: formattedSymbol,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    };

    const configString = JSON.stringify(config);
    script.text = configString;
    script.innerHTML = configString;

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-[540px] rounded-2xl border border-white/10 bg-[#06101d] p-1 overflow-hidden">
      <div
        ref={containerRef}
        className="tradingview-widget-container h-full w-full"
      />
    </div>
  );
}

export default memo(TradingViewWidget);
