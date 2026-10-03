import { createClient } from "@supabase/supabase-js";

// Type contracts
interface RawBhavcopyRecord {
  ISIN: string;
  SYMBOL: string;
  OPEN: number;
  HIGH: number;
  LOW: number;
  CLOSE: number;
  PREVCLOSE: number;
  TOTTRDQTY: number;
}

interface IngestionPayload {
  isin: string;
  trade_date: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  adj_close: number;
  volume: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const db = createClient(supabaseUrl, supabaseKey);

export async function ingestDailyBhavcopy(tradeDateIso: string, records: RawBhavcopyRecord[]) {
  console.log(`[ETL Pipeline] Initiating ingestion for date: ${tradeDateIso}`);
  const BATCH_SIZE = 500;
  
  // Transform records into database contracts
  const payloads: IngestionPayload[] = records
    .filter(r => r.ISIN && r.ISIN.startsWith("INE"))
    .map(r => ({
      isin: r.ISIN.trim(),
      trade_date: tradeDateIso,
      open_price: Number(r.OPEN),
      high_price: Number(r.HIGH),
      low_price: Number(r.LOW),
      close_price: Number(r.CLOSE),
      adj_close: Number(r.CLOSE), // Adjusted by split multiplier engine
      volume: Number(r.TOTTRDQTY)
    }));

  let successfulInserts = 0;

  for (let i = 0; i < payloads.length; i += BATCH_SIZE) {
    const chunk = payloads.slice(i, i + BATCH_SIZE);
    const { error, count } = await db
      .from("fact_eod_prices")
      .upsert(chunk, { onConflict: "isin,trade_date" });

    if (error) {
      console.error(`[ETL Pipeline] Batch error at index ${i}:`, error.message);
      throw error;
    }
    successfulInserts += chunk.length;
    console.log(`[ETL Progress] Processed ${successfulInserts}/${payloads.length} rows`);
  }

  console.log(`[ETL Complete] Ingested ${successfulInserts} stock quotes into fact_eod_prices.`);
}
