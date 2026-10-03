-- ============================================================================
-- 1. STOCKS MASTER DIMENSION (ISIN Immutable Anchor)
-- ============================================================================
CREATE TABLE IF NOT EXISTS dim_stocks (
    isin VARCHAR(12) PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL UNIQUE,
    bse_code VARCHAR(10) UNIQUE,
    company_name TEXT NOT NULL,
    sector TEXT NOT NULL,
    industry TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dim_stocks_symbol ON dim_stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_dim_stocks_bse ON dim_stocks(bse_code);

-- ============================================================================
-- 2. FACT EOD PRICES (Partitionable by Trade Date)
-- ============================================================================
CREATE TABLE IF NOT EXISTS fact_eod_prices (
    isin VARCHAR(12) REFERENCES dim_stocks(isin) ON DELETE CASCADE,
    trade_date DATE NOT NULL,
    open_price NUMERIC(12, 2) NOT NULL,
    high_price NUMERIC(12, 2) NOT NULL,
    low_price NUMERIC(12, 2) NOT NULL,
    close_price NUMERIC(12, 2) NOT NULL,
    adj_close NUMERIC(12, 2) NOT NULL,
    volume BIGINT NOT NULL,
    PRIMARY KEY (isin, trade_date)
);

CREATE INDEX IF NOT EXISTS idx_fact_eod_lookup 
ON fact_eod_prices(isin, trade_date DESC);

-- ============================================================================
-- 3. FACT FUNDAMENTAL FINANCIALS (Quarterly & Annual Disclosures)
-- ============================================================================
CREATE TABLE IF NOT EXISTS fact_financials (
    id BIGSERIAL PRIMARY KEY,
    isin VARCHAR(12) REFERENCES dim_stocks(isin) ON DELETE CASCADE,
    period_end DATE NOT NULL,
    period_type VARCHAR(2) CHECK (period_type IN ('Q', 'FY')),
    net_sales NUMERIC(15, 2) NOT NULL,
    operating_expenses NUMERIC(15, 2) NOT NULL,
    operating_profit NUMERIC(15, 2) NOT NULL,
    net_profit NUMERIC(15, 2) NOT NULL,
    total_assets NUMERIC(15, 2) NOT NULL,
    shareholders_equity NUMERIC(15, 2) NOT NULL,
    promoter_pledge_pct NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (isin, period_end, period_type)
);

CREATE INDEX IF NOT EXISTS idx_fact_financials_period 
ON fact_financials(isin, period_end DESC);

-- ============================================================================
-- 4. ANALYTIC VIEW: 3-STAGE DUPONT DECOMPOSITION ENGINE
-- ============================================================================
CREATE OR REPLACE VIEW vw_dupont_analysis AS
WITH ranked_financials AS (
    SELECT 
        isin,
        period_end,
        period_type,
        net_sales,
        operating_profit,
        net_profit,
        total_assets,
        shareholders_equity,
        ROW_NUMBER() OVER(PARTITION BY isin ORDER BY period_end DESC) as rn
    FROM fact_financials
)
SELECT 
    rf.isin,
    rf.period_end,
    -- Operating Profit Margin: OPM % = (Operating Profit / Sales) * 100
    ROUND((rf.operating_profit / NULLIF(rf.net_sales, 0)) * 100, 2) AS opm_pct,
    -- DuPont Factor 1: Net Margin % = (Net Profit / Sales) * 100
    ROUND((rf.net_profit / NULLIF(rf.net_sales, 0)) * 100, 2) AS net_profit_margin_pct,
    -- DuPont Factor 2: Asset Turnover = Sales / Total Assets
    ROUND(rf.net_sales / NULLIF(rf.total_assets, 0), 2) AS asset_turnover,
    -- DuPont Factor 3: Financial Leverage (Equity Multiplier) = Total Assets / Equity
    ROUND(rf.total_assets / NULLIF(rf.shareholders_equity, 0), 2) AS equity_multiplier,
    -- Consolidated ROE = Factor 1 * Factor 2 * Factor 3
    ROUND((rf.net_profit / NULLIF(rf.shareholders_equity, 0)) * 100, 2) AS roe_pct
FROM ranked_financials rf
WHERE rf.rn = 1;

-- ============================================================================
-- 5. ANALYTIC VIEW: TECH-FUNDA™ REAL-TIME COMPOSITE MATRIX
-- ============================================================================
CREATE OR REPLACE VIEW vw_tech_funda_matrix AS
WITH price_windows AS (
    SELECT 
        isin,
        trade_date,
        close_price,
        volume,
        ROUND(AVG(close_price) OVER(
            PARTITION BY isin ORDER BY trade_date 
            ROWS BETWEEN 49 PRECEDING AND CURRENT ROW
        ), 2) AS dma_50,
        ROUND(AVG(close_price) OVER(
            PARTITION BY isin ORDER BY trade_date 
            ROWS BETWEEN 199 PRECEDING AND CURRENT ROW
        ), 2) AS dma_200,
        ROW_NUMBER() OVER(PARTITION BY isin ORDER BY trade_date DESC) as rn
    FROM fact_eod_prices
)
SELECT 
    s.symbol,
    s.isin,
    s.company_name,
    s.sector,
    s.bse_code,
    pw.close_price AS cmp,
    pw.dma_50,
    pw.dma_200,
    pw.volume,
    dp.opm_pct,
    dp.net_profit_margin_pct,
    dp.asset_turnover,
    dp.equity_multiplier,
    dp.roe_pct,
    CASE 
        WHEN pw.close_price >= pw.dma_50 
         AND pw.dma_50 >= pw.dma_200 
         AND dp.roe_pct >= 18.0 
         AND dp.equity_multiplier < 3.5 THEN 'STRONG'
        WHEN pw.close_price >= pw.dma_200 
         AND dp.roe_pct >= 12.0 THEN 'MODERATE'
        ELSE 'WATCHLIST'
    END AS tech_funda_signal
FROM dim_stocks s
LEFT JOIN price_windows pw ON s.isin = pw.isin AND pw.rn = 1
LEFT JOIN vw_dupont_analysis dp ON s.isin = dp.isin;
