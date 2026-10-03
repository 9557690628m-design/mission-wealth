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

    container.innerHTML = "";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = "100%";
    widgetDiv.style.width = "100%";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const formattedSymbol = symbol.toUpperCase().includes(":")
      ? symbol.toUpperCase()
      : `NSE:${symbol.toUpperCase()}`;

    script.innerHTML = JSON.stringify({
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
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div className="w-full h-[520px] rounded-2xl border border-white/10 bg-black/40 p-2 overflow-hidden">
      <div ref={containerRef} className="tradingview-widget-container h-full w-full" />
    </div>
  );
}

export default memo(TradingViewWidget);
