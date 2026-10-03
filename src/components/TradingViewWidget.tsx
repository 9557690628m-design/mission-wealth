"use client";

import React, { memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  // Normalize ticker symbol to NSE exchange format
  const rawSymbol = (symbol || "TCS").trim().toUpperCase();
  const formattedSymbol = rawSymbol.includes(":") ? rawSymbol : `NSE:${rawSymbol}`;

  const widgetConfig = {
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

  const iframeSrc = `https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#${encodeURIComponent(
    JSON.stringify(widgetConfig)
  )}`;

  return (
    <div className="w-full h-[540px] rounded-2xl border border-white/10 bg-[#06101d] p-1 overflow-hidden">
      <iframe
        key={formattedSymbol}
        src={iframeSrc}
        title={`TradingView Chart - ${formattedSymbol}`}
        className="w-full h-full border-0"
        allowTransparency={true}
        scrolling="no"
      />
    </div>
  );
}

export default memo(TradingViewWidget);
