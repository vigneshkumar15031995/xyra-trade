import Head from 'next/head';
import Header from '../components/layout/Header';
import TickerBar from '../components/exchange/TickerBar';
import ChartSection from '../components/exchange/ChartSection';
import OrderBook from '../components/exchange/OrderBook';
import TradeForm from '../components/exchange/TradeForm';
import PositionsPanel from '../components/exchange/PositionsPanel';

export default function Exchange() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text-primary font-sans">
      <Head>
        <title>Xyra Labs | Perpetual Exchange</title>
        <meta name="description" content="Next Gen Perp Exchange" />
      </Head>

      {/* 1. Header (Fixed Height 56px) */}
      <Header />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex mt-16">

        {/* MAIN WRAPPER: Ticker, Chart, Positions, OrderBook */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-brand-border">

          {/* TOP SECTION: Ticker + Chart + OrderBook */}
          <div className="flex flex-row w-full">

            {/* LEFT COLUMN: Ticker + Chart (80%) */}
            <div className="w-[80%] flex flex-col border-r border-brand-border">
              <TickerBar />
              {/* Chart Section with specific fixed height */}
              <div className="h-[38.25rem] border-t border-brand-border">
                <ChartSection />
              </div>
            </div>

            {/* MIDDLE COLUMN: Orderbook (20%) */}
            <div className="w-[20%] flex flex-col bg-brand-bg hidden lg:flex border-l border-brand-border">
              <OrderBook />
            </div>

          </div>

          {/* BOTTOM SECTION: PositionsPanel */}
          <div className="min-h-[300px] border-t border-brand-border">
            <PositionsPanel />
          </div>

        </div>

        {/* RIGHT COLUMN: TradeForm (20%) - Separate */}
        <div className="w-[20%] flex flex-col bg-brand-bg hidden xl:flex border-l border-brand-border">
          <TradeForm />
        </div>

      </main>
    </div>
  );
}
