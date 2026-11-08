"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import type {
  MarketCandle,
} from "../../lib/market/candles/types";

import {
  calculateExponentialMovingAverageSeries,
  calculateMacdSeries,
  calculateRsiSeries,
  calculateSimpleMovingAverageSeries,
} from "../../lib/market/indicators";

interface MissionMarketChartProps {
  candles: MarketCandle[];
  height?: number;
}

interface ChartLayout {
  width: number;
  height: number;
  plotLeft: number;
  plotRight: number;
  plotTop: number;
  priceBottom: number;
  volumeTop: number;
  volumeBottom: number;
  rsiTop: number;
  rsiBottom: number;
  macdTop: number;
  macdBottom: number;
}

interface PriceRange {
  min: number;
  max: number;
}

const DEFAULT_HEIGHT = 760;
const PRICE_AXIS_WIDTH = 78;
const LEFT_PADDING = 12;
const TOP_PADDING = 20;
const BOTTOM_AXIS_HEIGHT = 34;
const VOLUME_HEIGHT_RATIO = 0.2;
const SECTION_GAP = 12;

const DEFAULT_VISIBLE_CANDLES = 80;
const MIN_VISIBLE_CANDLES = 12;
const ZOOM_FACTOR = 0.15;

function formatPrice(
  value: number
): string {
  if (
    Math.abs(value) >=
    1000
  ) {
    return value.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  }

  return value.toFixed(2);
}

function formatCompactVolume(
  value: number
): string {
  if (value >= 10_000_000) {
    return `${(
      value /
      10_000_000
    ).toFixed(1)}Cr`;
  }

  if (value >= 100_000) {
    return `${(
      value /
      100_000
    ).toFixed(1)}L`;
  }

  if (value >= 1_000) {
    return `${(
      value /
      1_000
    ).toFixed(1)}K`;
  }

  return value.toFixed(0);
}

function formatDate(
  timestamp: string
): string {
  const date =
    new Date(timestamp);

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

function calculatePriceRange(
  candles: MarketCandle[]
): PriceRange {
  let min =
    Number.POSITIVE_INFINITY;
  let max =
    Number.NEGATIVE_INFINITY;

  for (
    const candle of candles
  ) {
    if (
      candle.low < min
    ) {
      min = candle.low;
    }

    if (
      candle.high > max
    ) {
      max = candle.high;
    }
  }

  if (
    !Number.isFinite(min) ||
    !Number.isFinite(max)
  ) {
    return {
      min: 0,
      max: 1,
    };
  }

  if (min === max) {
    const padding =
      Math.max(
        Math.abs(min) * 0.01,
        1
      );

    return {
      min:
        min - padding,
      max:
        max + padding,
    };
  }

  const span =
    max - min;

  const padding =
    span * 0.06;

  return {
    min:
      min - padding,
    max:
      max + padding,
  };
}

function createLayout(
  width: number,
  height: number
): ChartLayout {
  const plotLeft =
    LEFT_PADDING;

  const plotRight =
    Math.max(
      plotLeft + 1,
      width -
        PRICE_AXIS_WIDTH
    );

  const plotTop =
    TOP_PADDING;

  const chartBottom =
    Math.max(
      plotTop + 180,
      height -
        BOTTOM_AXIS_HEIGHT
    );

  const availableHeight =
    chartBottom -
    plotTop;

  const rsiHeight =
    Math.max(
      90,
      availableHeight * 0.16
    );

  const macdHeight =
    Math.max(
      100,
      availableHeight * 0.18
    );

  const volumeHeight =
    Math.max(
      55,
      availableHeight *
        0.14
    );

  const macdBottom =
    chartBottom;

  const macdTop =
    macdBottom -
    macdHeight;

  const rsiBottom =
    macdTop -
    SECTION_GAP;

  const rsiTop =
    rsiBottom -
    rsiHeight;

  const volumeBottom =
    rsiTop -
    SECTION_GAP;

  const volumeTop =
    volumeBottom -
    volumeHeight;

  const priceBottom =
    Math.max(
      plotTop + 1,
      volumeTop -
        SECTION_GAP
    );

  return {
    width,
    height,
    plotLeft,
    plotRight,
    plotTop,
    priceBottom,
    volumeTop,
    volumeBottom,
    rsiTop,
    rsiBottom,
    macdTop,
    macdBottom,
  };
}

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(
    Math.max(
      value,
      min
    ),
    max
  );
}

function getCanvasPoint(
  event: PointerEvent,
  canvas: HTMLCanvasElement
): {
  x: number;
  y: number;
} {
  const rect =
    canvas.getBoundingClientRect();

  return {
    x:
      event.clientX -
      rect.left,
    y:
      event.clientY -
      rect.top,
  };
}

export default function MissionMarketChart({
  candles,
  height = DEFAULT_HEIGHT,
}: MissionMarketChartProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const orderedCandles =
    useMemo(
      () =>
        [...candles].sort(
          (a, b) =>
            Date.parse(
              a.timestamp
            ) -
            Date.parse(
              b.timestamp
            )
        ),
      [candles]
    );

  const indicatorSeries =
    useMemo(
      () => ({
        sma50:
          calculateSimpleMovingAverageSeries(
            orderedCandles,
            50
          ),
        sma200:
          calculateSimpleMovingAverageSeries(
            orderedCandles,
            200
          ),
        ema20:
          calculateExponentialMovingAverageSeries(
            orderedCandles,
            20
          ),
        ema50:
          calculateExponentialMovingAverageSeries(
            orderedCandles,
            50
          ),
        rsi14:
          calculateRsiSeries(
            orderedCandles,
            14
          ),
        macd:
          calculateMacdSeries(
            orderedCandles,
            12,
            26,
            9
          ),
      }),
      [orderedCandles]
    );

  useEffect(
    () => {
      const container =
        containerRef.current;

      const canvas =
        canvasRef.current;

      if (
        !container ||
        !canvas
      ) {
        return;
      }

      const context =
        canvas.getContext(
          "2d"
        );

      if (!context) {
        return;
      }

      const totalCandles =
        orderedCandles.length;

      let visibleCount =
        Math.min(
          totalCandles,
          DEFAULT_VISIBLE_CANDLES
        );

      let visibleStart =
        Math.max(
          0,
          totalCandles -
            visibleCount
        );

      let hoverIndex:
        number | null =
          null;

      let hoverX:
        number | null =
          null;

      let hoverY:
        number | null =
          null;

      let currentLayout:
        ChartLayout | null =
          null;

      let currentStep =
        0;

      let dragging =
        false;

      let dragStartX =
        0;

      let dragStartVisibleStart =
        0;

      const normalizeViewport =
        () => {
          if (
            totalCandles ===
            0
          ) {
            visibleCount =
              0;
            visibleStart =
              0;
            return;
          }

          const minimum =
            Math.min(
              MIN_VISIBLE_CANDLES,
              totalCandles
            );

          visibleCount =
            clamp(
              Math.round(
                visibleCount
              ),
              minimum,
              totalCandles
            );

          visibleStart =
            clamp(
              Math.round(
                visibleStart
              ),
              0,
              Math.max(
                0,
                totalCandles -
                  visibleCount
              )
            );
        };

      const resetViewport =
        () => {
          visibleCount =
            Math.min(
              totalCandles,
              DEFAULT_VISIBLE_CANDLES
            );

          visibleStart =
            Math.max(
              0,
              totalCandles -
                visibleCount
            );

          hoverIndex =
            null;

          hoverX =
            null;

          hoverY =
            null;

          normalizeViewport();
        };

      const draw =
        () => {
          const rect =
            container.getBoundingClientRect();

          const width =
            Math.max(
              320,
              Math.floor(
                rect.width
              )
            );

          const chartHeight =
            Math.max(
              320,
              Math.floor(
                height
              )
            );

          const dpr =
            window.devicePixelRatio ||
            1;

          canvas.width =
            Math.floor(
              width * dpr
            );

          canvas.height =
            Math.floor(
              chartHeight *
                dpr
            );

          canvas.style.width =
            `${width}px`;

          canvas.style.height =
            `${chartHeight}px`;

          context.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
          );

          context.clearRect(
            0,
            0,
            width,
            chartHeight
          );

          const layout =
            createLayout(
              width,
              chartHeight
            );

          currentLayout =
            layout;

          const styles =
            getComputedStyle(
              container
            );

          const textColor =
            styles.color ||
            "#111827";

          const backgroundColor =
            styles.backgroundColor &&
            styles.backgroundColor !==
              "rgba(0, 0, 0, 0)"
              ? styles.backgroundColor
              : "#ffffff";

          context.fillStyle =
            backgroundColor;

          context.fillRect(
            0,
            0,
            width,
            chartHeight
          );

          if (
            totalCandles ===
            0
          ) {
            context.fillStyle =
              textColor;

            context.font =
              "14px system-ui, sans-serif";

            context.textAlign =
              "center";

            context.textBaseline =
              "middle";

            context.fillText(
              "Verified market history is unavailable.",
              width / 2,
              chartHeight / 2
            );

            return;
          }

          normalizeViewport();

          const visibleCandles =
            orderedCandles.slice(
              visibleStart,
              visibleStart +
                visibleCount
            );

          if (
            visibleCandles.length ===
            0
          ) {
            return;
          }

          const priceRange =
            calculatePriceRange(
              visibleCandles
            );

          const priceSpan =
            priceRange.max -
            priceRange.min;

          const plotWidth =
            Math.max(
              1,
              layout.plotRight -
                layout.plotLeft
            );

          const priceHeight =
            Math.max(
              1,
              layout.priceBottom -
                layout.plotTop
            );

          const count =
            visibleCandles.length;

          const step =
            plotWidth /
            Math.max(
              count,
              1
            );

          currentStep =
            step;

          const candleWidth =
            Math.max(
              1,
              Math.min(
                12,
                step * 0.68
              )
            );

          const priceToY =
            (
              price: number
            ): number =>
              layout.priceBottom -
              (
                (
                  price -
                  priceRange.min
                ) /
                priceSpan
              ) *
                priceHeight;

          const indexToX =
            (
              index: number
            ): number =>
              layout.plotLeft +
              step *
                (
                  index +
                  0.5
                );

          let maxVolume =
            0;

          for (
            const candle of
              visibleCandles
          ) {
            if (
              candle.volume !==
                null &&
              candle.volume >
                maxVolume
            ) {
              maxVolume =
                candle.volume;
            }
          }

          context.lineWidth =
            1;

          context.font =
            "11px system-ui, sans-serif";

          context.textAlign =
            "right";

          context.textBaseline =
            "middle";

          const gridLines =
            5;

          for (
            let index = 0;
            index <= gridLines;
            index += 1
          ) {
            const ratio =
              index /
              gridLines;

            const y =
              layout.plotTop +
              ratio *
                priceHeight;

            const value =
              priceRange.max -
              ratio *
                priceSpan;

            context.strokeStyle =
              "rgba(148, 163, 184, 0.20)";

            context.beginPath();

            context.moveTo(
              layout.plotLeft,
              y
            );

            context.lineTo(
              layout.plotRight,
              y
            );

            context.stroke();

            context.fillStyle =
              textColor;

            context.fillText(
              formatPrice(
                value
              ),
              width - 8,
              y
            );
          }

          context.strokeStyle =
            "rgba(148, 163, 184, 0.24)";

          context.beginPath();

          context.moveTo(
            layout.plotRight,
            layout.plotTop
          );

          context.lineTo(
            layout.plotRight,
            layout.volumeBottom
          );

          context.stroke();

          for (
            let index = 0;
            index < count;
            index += 1
          ) {
            const candle =
              visibleCandles[
                index
              ]!;

            const x =
              indexToX(
                index
              );

            const openY =
              priceToY(
                candle.open
              );

            const closeY =
              priceToY(
                candle.close
              );

            const highY =
              priceToY(
                candle.high
              );

            const lowY =
              priceToY(
                candle.low
              );

            const rising =
              candle.close >=
              candle.open;

            const candleColor =
              rising
                ? "#16a34a"
                : "#dc2626";

            context.strokeStyle =
              candleColor;

            context.fillStyle =
              candleColor;

            context.beginPath();

            context.moveTo(
              x,
              highY
            );

            context.lineTo(
              x,
              lowY
            );

            context.stroke();

            const bodyTop =
              Math.min(
                openY,
                closeY
              );

            const bodyHeight =
              Math.max(
                1,
                Math.abs(
                  closeY -
                    openY
                )
              );

            context.fillRect(
              x -
                candleWidth /
                  2,
              bodyTop,
              candleWidth,
              bodyHeight
            );

            if (
              candle.volume !==
                null &&
              maxVolume > 0
            ) {
              const volumeHeight =
                (
                  candle.volume /
                  maxVolume
                ) *
                (
                  layout.volumeBottom -
                  layout.volumeTop
                );

              context.globalAlpha =
                0.32;

              context.fillRect(
                x -
                  candleWidth /
                    2,
                layout.volumeBottom -
                  volumeHeight,
                candleWidth,
                volumeHeight
              );

              context.globalAlpha =
                1;
            }
          }


          const drawIndicatorLine =
            (
              values: Array<number | null>,
              strokeStyle: string,
              lineWidth = 1.4
            ) => {
              context.save();

              context.strokeStyle =
                strokeStyle;

              context.lineWidth =
                lineWidth;

              context.beginPath();

              let started =
                false;

              for (
                let index = 0;
                index < count;
                index += 1
              ) {
                const globalIndex =
                  visibleStart +
                  index;

                const value =
                  values[
                    globalIndex
                  ];

                if (
                  value === null ||
                  value === undefined
                ) {
                  started =
                    false;
                  continue;
                }

                const x =
                  indexToX(
                    index
                  );

                const y =
                  priceToY(
                    value
                  );

                if (
                  !started
                ) {
                  context.moveTo(
                    x,
                    y
                  );

                  started =
                    true;
                } else {
                  context.lineTo(
                    x,
                    y
                  );
                }
              }

              context.stroke();

              context.restore();
            };

          drawIndicatorLine(
            indicatorSeries.ema20,
            "#2563eb",
            1.5
          );

          drawIndicatorLine(
            indicatorSeries.ema50,
            "#7c3aed",
            1.5
          );

          drawIndicatorLine(
            indicatorSeries.sma50,
            "#d97706",
            1.35
          );

          drawIndicatorLine(
            indicatorSeries.sma200,
            "#0f766e",
            1.35
          );


          const drawPanelDivider =
            (
              y: number
            ) => {
              context.strokeStyle =
                "rgba(148, 163, 184, 0.28)";

              context.beginPath();

              context.moveTo(
                layout.plotLeft,
                y
              );

              context.lineTo(
                layout.plotRight,
                y
              );

              context.stroke();
            };

          drawPanelDivider(
            layout.rsiTop
          );

          drawPanelDivider(
            layout.macdTop
          );

          const rsiHeight =
            Math.max(
              1,
              layout.rsiBottom -
                layout.rsiTop
            );

          const rsiToY =
            (
              value: number
            ): number =>
              layout.rsiBottom -
              (
                clamp(
                  value,
                  0,
                  100
                ) /
                100
              ) *
                rsiHeight;

          for (
            const level of [
              30,
              50,
              70,
            ]
          ) {
            const y =
              rsiToY(
                level
              );

            context.strokeStyle =
              level === 50
                ? "rgba(148, 163, 184, 0.22)"
                : "rgba(148, 163, 184, 0.30)";

            context.setLineDash(
              level === 50
                ? []
                : [4, 4]
            );

            context.beginPath();

            context.moveTo(
              layout.plotLeft,
              y
            );

            context.lineTo(
              layout.plotRight,
              y
            );

            context.stroke();

            context.setLineDash(
              []
            );

            context.fillStyle =
              textColor;

            context.font =
              "10px system-ui, sans-serif";

            context.textAlign =
              "right";

            context.textBaseline =
              "middle";

            context.fillText(
              String(
                level
              ),
              width - 8,
              y
            );
          }

          context.strokeStyle =
            "#9333ea";

          context.lineWidth =
            1.4;

          context.beginPath();

          let rsiStarted =
            false;

          for (
            let index = 0;
            index < count;
            index += 1
          ) {
            const globalIndex =
              visibleStart +
              index;

            const value =
              indicatorSeries.rsi14[
                globalIndex
              ];

            if (
              value === null ||
              value === undefined
            ) {
              rsiStarted =
                false;
              continue;
            }

            const x =
              indexToX(
                index
              );

            const y =
              rsiToY(
                value
              );

            if (
              !rsiStarted
            ) {
              context.moveTo(
                x,
                y
              );

              rsiStarted =
                true;
            } else {
              context.lineTo(
                x,
                y
              );
            }
          }

          context.stroke();

          context.fillStyle =
            textColor;

          context.font =
            "11px system-ui, sans-serif";

          context.textAlign =
            "left";

          context.textBaseline =
            "top";

          context.fillText(
            "RSI 14",
            layout.plotLeft + 4,
            layout.rsiTop + 4
          );

          const visibleMacd =
            indicatorSeries.macd.slice(
              visibleStart,
              visibleStart +
                count
            );

          let macdAbsMax =
            0;

          for (
            const point of
              visibleMacd
          ) {
            for (
              const value of [
                point.macd,
                point.signal,
                point.histogram,
              ]
            ) {
              if (
                value !== null &&
                Number.isFinite(
                  value
                )
              ) {
                macdAbsMax =
                  Math.max(
                    macdAbsMax,
                    Math.abs(
                      value
                    )
                  );
              }
            }
          }

          if (
            macdAbsMax === 0
          ) {
            macdAbsMax = 1;
          }

          const macdHeight =
            Math.max(
              1,
              layout.macdBottom -
                layout.macdTop
            );

          const macdMid =
            (
              layout.macdTop +
              layout.macdBottom
            ) /
            2;

          const macdToY =
            (
              value: number
            ): number =>
              macdMid -
              (
                value /
                macdAbsMax
              ) *
                (
                  macdHeight *
                  0.42
                );

          context.strokeStyle =
            "rgba(148, 163, 184, 0.30)";

          context.beginPath();

          context.moveTo(
            layout.plotLeft,
            macdMid
          );

          context.lineTo(
            layout.plotRight,
            macdMid
          );

          context.stroke();

          for (
            let index = 0;
            index < count;
            index += 1
          ) {
            const point =
              visibleMacd[
                index
              ];

            if (
              !point ||
              point.histogram ===
                null
            ) {
              continue;
            }

            const x =
              indexToX(
                index
              );

            const y =
              macdToY(
                point.histogram
              );

            const barWidth =
              Math.max(
                1,
                Math.min(
                  8,
                  currentStep * 0.5
                )
              );

            context.fillStyle =
              point.histogram >=
                0
                ? "rgba(22, 163, 74, 0.45)"
                : "rgba(220, 38, 38, 0.45)";

            context.fillRect(
              x -
                barWidth /
                  2,
              Math.min(
                y,
                macdMid
              ),
              barWidth,
              Math.max(
                1,
                Math.abs(
                  macdMid -
                    y
                )
              )
            );
          }

          const drawMacdLine =
            (
              key:
                | "macd"
                | "signal",
              strokeStyle: string
            ) => {
              context.strokeStyle =
                strokeStyle;

              context.lineWidth =
                1.35;

              context.beginPath();

              let started =
                false;

              for (
                let index = 0;
                index < count;
                index += 1
              ) {
                const point =
                  visibleMacd[
                    index
                  ];

                const value =
                  point?.[
                    key
                  ];

                if (
                  value === null ||
                  value === undefined
                ) {
                  started =
                    false;
                  continue;
                }

                const x =
                  indexToX(
                    index
                  );

                const y =
                  macdToY(
                    value
                  );

                if (
                  !started
                ) {
                  context.moveTo(
                    x,
                    y
                  );

                  started =
                    true;
                } else {
                  context.lineTo(
                    x,
                    y
                  );
                }
              }

              context.stroke();
            };

          drawMacdLine(
            "macd",
            "#2563eb"
          );

          drawMacdLine(
            "signal",
            "#f59e0b"
          );

          context.fillStyle =
            textColor;

          context.font =
            "11px system-ui, sans-serif";

          context.textAlign =
            "left";

          context.textBaseline =
            "top";

          context.fillText(
            "MACD 12,26,9",
            layout.plotLeft + 4,
            layout.macdTop + 4
          );

          const labelCount =
            Math.min(
              6,
              count
            );

          context.fillStyle =
            textColor;

          context.textAlign =
            "center";

          context.textBaseline =
            "top";

          for (
            let labelIndex = 0;
            labelIndex <
              labelCount;
            labelIndex += 1
          ) {
            const candleIndex =
              labelCount === 1
                ? 0
                : Math.round(
                    (
                      labelIndex *
                      (
                        count -
                        1
                      )
                    ) /
                      (
                        labelCount -
                        1
                      )
                  );

            const candle =
              visibleCandles[
                candleIndex
              ]!;

            context.fillText(
              new Date(
                candle.timestamp
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  timeZone:
                    "UTC",
                }
              ),
              indexToX(
                candleIndex
              ),
              layout.macdBottom +
                8
            );
          }

          if (
            hoverIndex !==
              null &&
            hoverIndex >= 0 &&
            hoverIndex <
              count &&
            hoverX !== null &&
            hoverY !== null
          ) {
            const candle =
              visibleCandles[
                hoverIndex
              ]!;

            const x =
              indexToX(
                hoverIndex
              );

            context.save();

            context.setLineDash(
              [4, 4]
            );

            context.strokeStyle =
              "rgba(100, 116, 139, 0.75)";

            context.beginPath();

            context.moveTo(
              x,
              layout.plotTop
            );

            context.lineTo(
              x,
              layout.macdBottom
            );

            context.stroke();

            if (
              hoverY >=
                layout.plotTop &&
              hoverY <=
                layout.priceBottom
            ) {
              context.beginPath();

              context.moveTo(
                layout.plotLeft,
                hoverY
              );

              context.lineTo(
                layout.plotRight,
                hoverY
              );

              context.stroke();
            }

            context.restore();

            const info =
              `${formatDate(
                candle.timestamp
              )}   O ${formatPrice(
                candle.open
              )}   H ${formatPrice(
                candle.high
              )}   L ${formatPrice(
                candle.low
              )}   C ${formatPrice(
                candle.close
              )}${
                candle.volume !==
                null
                  ? `   V ${formatCompactVolume(
                      candle.volume
                    )}`
                  : ""
              }`;

            context.font =
              "12px system-ui, sans-serif";

            const infoWidth =
              context.measureText(
                info
              ).width +
              20;

            const boxX =
              Math.min(
                Math.max(
                  layout.plotLeft +
                    4,
                  hoverX + 12
                ),
                layout.plotRight -
                  infoWidth -
                  4
              );

            const boxY =
              layout.plotTop +
              6;

            context.fillStyle =
              "rgba(15, 23, 42, 0.92)";

            context.fillRect(
              boxX,
              boxY,
              infoWidth,
              30
            );

            context.fillStyle =
              "#ffffff";

            context.textAlign =
              "left";

            context.textBaseline =
              "middle";

            context.fillText(
              info,
              boxX + 10,
              boxY + 15
            );
          }

          const first =
            visibleCandles[0];

          const last =
            visibleCandles[
              visibleCandles.length -
                1
            ];

          if (
            first &&
            last
          ) {
            const rangeText =
              `${formatDate(
                first.timestamp
              )} – ${formatDate(
                last.timestamp
              )} · ${visibleCandles.length} candles`;

            context.font =
              "11px system-ui, sans-serif";

            context.fillStyle =
              textColor;

            context.textAlign =
              "left";

            context.textBaseline =
              "bottom";

            context.fillText(
              rangeText,
              layout.plotLeft,
              layout.height - 4
            );
          }
        };

      const handlePointerMove =
        (
          event: PointerEvent
        ) => {
          if (
            !currentLayout ||
            totalCandles ===
              0 ||
            currentStep <= 0
          ) {
            return;
          }

          const point =
            getCanvasPoint(
              event,
              canvas
            );

          if (dragging) {
            const deltaX =
              point.x -
              dragStartX;

            const candleShift =
              Math.round(
                deltaX /
                  currentStep
              );

            visibleStart =
              dragStartVisibleStart -
              candleShift;

            normalizeViewport();

            hoverIndex =
              null;

            hoverX =
              null;

            hoverY =
              null;

            draw();
            return;
          }

          hoverX =
            point.x;

          hoverY =
            point.y;

          const rawIndex =
            Math.floor(
              (
                point.x -
                currentLayout.plotLeft
              ) /
                currentStep
            );

          hoverIndex =
            clamp(
              rawIndex,
              0,
              Math.max(
                0,
                visibleCount - 1
              )
            );

          draw();
        };

      const handlePointerDown =
        (
          event: PointerEvent
        ) => {
          if (
            event.button !== 0 ||
            totalCandles ===
              0
          ) {
            return;
          }

          const point =
            getCanvasPoint(
              event,
              canvas
            );

          dragging =
            true;

          dragStartX =
            point.x;

          dragStartVisibleStart =
            visibleStart;

          canvas.setPointerCapture(
            event.pointerId
          );

          canvas.style.cursor =
            "grabbing";
        };

      const handlePointerUp =
        (
          event: PointerEvent
        ) => {
          dragging =
            false;

          if (
            canvas.hasPointerCapture(
              event.pointerId
            )
          ) {
            canvas.releasePointerCapture(
              event.pointerId
            );
          }

          canvas.style.cursor =
            "crosshair";
        };

      const handlePointerLeave =
        () => {
          if (!dragging) {
            hoverIndex =
              null;

            hoverX =
              null;

            hoverY =
              null;

            draw();
          }
        };

      const handleWheel =
        (
          event: WheelEvent
        ) => {
          if (
            !currentLayout ||
            totalCandles ===
              0
          ) {
            return;
          }

          event.preventDefault();

          const rect =
            canvas.getBoundingClientRect();

          const x =
            event.clientX -
            rect.left;

          const plotWidth =
            Math.max(
              1,
              currentLayout.plotRight -
                currentLayout.plotLeft
            );

          const cursorRatio =
            clamp(
              (
                x -
                currentLayout.plotLeft
              ) /
                plotWidth,
              0,
              1
            );

          const anchorIndex =
            visibleStart +
            cursorRatio *
              Math.max(
                visibleCount - 1,
                0
              );

          const zoomDirection =
            event.deltaY < 0
              ? -1
              : 1;

          const delta =
            Math.max(
              1,
              Math.round(
                visibleCount *
                  ZOOM_FACTOR
              )
            );

          const minimum =
            Math.min(
              MIN_VISIBLE_CANDLES,
              totalCandles
            );

          const newVisibleCount =
            clamp(
              visibleCount +
                zoomDirection *
                  delta,
              minimum,
              totalCandles
            );

          const newVisibleStart =
            anchorIndex -
            cursorRatio *
              Math.max(
                newVisibleCount -
                  1,
                0
              );

          visibleCount =
            newVisibleCount;

          visibleStart =
            newVisibleStart;

          normalizeViewport();

          hoverIndex =
            null;

          hoverX =
            null;

          hoverY =
            null;

          draw();
        };

      const handleDoubleClick =
        () => {
          resetViewport();
          draw();
        };

      const resizeObserver =
        new ResizeObserver(
          () => {
            draw();
          }
        );

      resizeObserver.observe(
        container
      );

      canvas.style.cursor =
        "crosshair";

      canvas.addEventListener(
        "pointermove",
        handlePointerMove
      );

      canvas.addEventListener(
        "pointerdown",
        handlePointerDown
      );

      canvas.addEventListener(
        "pointerup",
        handlePointerUp
      );

      canvas.addEventListener(
        "pointercancel",
        handlePointerUp
      );

      canvas.addEventListener(
        "pointerleave",
        handlePointerLeave
      );

      canvas.addEventListener(
        "wheel",
        handleWheel,
        {
          passive: false,
        }
      );

      canvas.addEventListener(
        "dblclick",
        handleDoubleClick
      );

      draw();

      return () => {
        resizeObserver.disconnect();

        canvas.removeEventListener(
          "pointermove",
          handlePointerMove
        );

        canvas.removeEventListener(
          "pointerdown",
          handlePointerDown
        );

        canvas.removeEventListener(
          "pointerup",
          handlePointerUp
        );

        canvas.removeEventListener(
          "pointercancel",
          handlePointerUp
        );

        canvas.removeEventListener(
          "pointerleave",
          handlePointerLeave
        );

        canvas.removeEventListener(
          "wheel",
          handleWheel
        );

        canvas.removeEventListener(
          "dblclick",
          handleDoubleClick
        );
      };
    },
    [
      height,
      orderedCandles,
      indicatorSeries,
    ]
  );

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-sm font-semibold">
            Mission Market Chart
          </p>

          <p className="text-xs text-slate-500">
            Candlestick price history and volume
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>
            Wheel: zoom
          </span>

          <span>
            Drag: pan
          </span>

          <span>
            Double-click: reset
          </span>

          {orderedCandles.length >
            0 && (
            <span className="text-right">
              {
                orderedCandles[
                  orderedCandles.length -
                    1
                ]!.exchange
              }
              {" · "}
              {
                orderedCandles[
                  orderedCandles.length -
                    1
                ]!.interval
              }
              {" · "}
              {
                orderedCandles[
                  orderedCandles.length -
                    1
                ]!.source
              }
            </span>
          )}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="block w-full touch-none select-none"
        aria-label="Mission Wealth interactive candlestick market chart"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          <span>
            EMA 20
          </span>

          <span>
            EMA 50
          </span>

          <span>
            SMA 50
          </span>

          <span>
            SMA 200
          </span>

          <span>
            RSI 14
          </span>

          <span>
            MACD 12,26,9
          </span>
        </div>

        <span>
          Verified provider data only. No synthetic market prices.
        </span>
      </div>
    </div>
  );
}
