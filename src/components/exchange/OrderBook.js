import React from 'react';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

export default function OrderBook() {
    const asks = [
        { price: '90,315', size: '0.01686', sum: '0.34485', relativeSize: 90 },
        { price: '90,228', size: '0.01500', sum: '0.32799', relativeSize: 85 },
        { price: '90,141', size: '0.01314', sum: '0.31299', relativeSize: 80 },
        { price: '90,053', size: '0.01127', sum: '0.29985', relativeSize: 75 },
        { price: '89,966', size: '0.00940', sum: '0.28858', relativeSize: 70 },
        { price: '89,878', size: '0.00753', sum: '0.27918', relativeSize: 65 },
        { price: '89,791', size: '0.00565', sum: '0.27165', relativeSize: 60 },
        { price: '89,703', size: '0.00377', sum: '0.26600', relativeSize: 55 },
        { price: '89,616', size: '0.00189', sum: '0.26223', relativeSize: 50 },
        { price: '87,608', size: '0.10000', sum: '0.26034', relativeSize: 45 },
        { price: '87,604', size: '0.00431', sum: '0.16034', relativeSize: 30 },
        { price: '89,966', size: '0.00940', sum: '0.28858', relativeSize: 70 },
        { price: '89,878', size: '0.00753', sum: '0.27918', relativeSize: 65 },
        { price: '89,791', size: '0.00565', sum: '0.27165', relativeSize: 60 },
        { price: '89,703', size: '0.00377', sum: '0.26600', relativeSize: 55 },
        { price: '89,616', size: '0.00189', sum: '0.26223', relativeSize: 50 },
        { price: '87,608', size: '0.10000', sum: '0.26034', relativeSize: 45 },
        { price: '87,604', size: '0.00431', sum: '0.16034', relativeSize: 30 },
    ];

    const bids = [
        { price: '87,353', size: '0.02039', sum: '0.32498', relativeSize: 90 },
        { price: '86,694', size: '0.00115', sum: '0.32613', relativeSize: 85 },
        { price: '86,651', size: '0.00115', sum: '0.32728', relativeSize: 80 },
        { price: '86,607', size: '0.00173', sum: '0.32901', relativeSize: 75 },
        { price: '85,244', size: '0.00198', sum: '0.33099', relativeSize: 70 },
        { price: '85,157', size: '0.00397', sum: '0.33496', relativeSize: 65 },
        { price: '85,100', size: '0.00880', sum: '0.34376', relativeSize: 60 },
        { price: '85,070', size: '0.00597', sum: '0.34973', relativeSize: 55 },
        { price: '84,982', size: '0.00796', sum: '0.35769', relativeSize: 50 },
        { price: '84,895', size: '0.00996', sum: '0.36765', relativeSize: 45 },
        { price: '86,651', size: '0.00115', sum: '0.32728', relativeSize: 80 },
        { price: '86,607', size: '0.00173', sum: '0.32901', relativeSize: 75 },
        { price: '85,244', size: '0.00198', sum: '0.33099', relativeSize: 70 },
        { price: '85,157', size: '0.00397', sum: '0.33496', relativeSize: 65 },
        { price: '85,100', size: '0.00880', sum: '0.34376', relativeSize: 60 },
        { price: '85,070', size: '0.00597', sum: '0.34973', relativeSize: 55 },
        { price: '84,982', size: '0.00796', sum: '0.35769', relativeSize: 50 },
        { price: '84,895', size: '0.00996', sum: '0.36765', relativeSize: 45 },
    ];

    const trades = [
        { price: '87,561', size: '0.00114', time: '22:52:14', side: 'buy' },
        { price: '87,552', size: '0.00114', time: '22:52:14', side: 'buy' },
        { price: '87,543', size: '0.00171', time: '22:52:14', side: 'buy' },
        { price: '87,575', size: '0.00228', time: '22:52:07', side: 'sell' },
        { price: '87,579', size: '0.00114', time: '22:52:07', side: 'buy' },
        { price: '87,570', size: '0.00114', time: '22:52:07', side: 'buy' },
    ];

    return (
        <div className="flex flex-col h-full bg-black text-xs font-mono">
            {/* 1. ORDERBOOK SECTION (approx 29.35rem total height based on md) */}
            <div className="flex flex-col border-b border-[#1E2026] h-[29.35rem]">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 h-[2.125rem] shrink-0">
                    <span className="text-white font-bold text-sm font-sans">Orderbook</span>
                    <div className="flex bg-[#1E2026] rounded p-0.5">
                        <button className="px-2 py-1 text-[10px] bg-[#2B3139] text-[#EAECEF] rounded font-bold">BTC</button>
                        <button className="px-2 py-1 text-[10px] text-[#848E9C] hover:text-[#EAECEF]">USD</button>
                    </div>
                </div>

                {/* Column Headers */}
                <div className="flex justify-between px-3 pb-1 text-[10px] text-[#848E9C] shrink-0">
                    <span>Price<br />(USDT)</span>
                    <span className="text-right">Size<br />(BTC)</span>
                    <span className="text-right">Sum<br />(BTC)</span>
                </div>

                {/* Asks (12rem height, hidden overflow by default, scroll on hover) */}
                <div className="h-[12rem] overflow-y-hidden custom-scroll hover:overflow-y-scroll border-transparent border-r-[3px] hover:border-r-0">
                    <div className="min-h-full flex flex-col justify-end pb-1">
                        {asks.map((ask, i) => (
                            <div key={i} className="flex px-3 py-[1px] relative hover:bg-[#1E2329] cursor-pointer group shrink-0">
                                <div className="absolute top-0 bottom-0 right-0 bg-[#F6465D]/15 z-0" style={{ width: `${ask.relativeSize}%` }}></div>
                                <span className="z-10 text-[#F6465D] flex-1">{ask.price}</span>
                                <span className="z-10 text-[#EAECEF] flex-1 text-right group-hover:text-white">{ask.size}</span>
                                <span className="z-10 text-[#848E9C] flex-1 text-right">{ask.sum}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spread (Fixed height) */}
                <div className="py-0.5 px-3 border-y border-[#1E2026] flex items-center justify-between bg-[#1E2329]/50 shrink-0">
                    <span className="text-lg font-bold text-[#0ECB81] flex items-center gap-1">
                        87,534 <ArrowUp className="w-4 h-4" />
                    </span>
                    <span className="text-[#EAECEF] text-[11px]">Spread 0.04%</span>
                </div>

                {/* Bids (12rem height, hidden overflow by default, scroll on hover) */}
                <div className="h-[12rem] overflow-y-hidden custom-scroll hover:overflow-y-scroll pt-1 border-transparent border-r-[3px] hover:border-r-0">
                    {bids.map((bid, i) => (
                        <div key={i} className="flex px-3 py-[1px] relative hover:bg-[#1E2329] cursor-pointer group shrink-0">
                            <div className="absolute top-0 bottom-0 right-0 bg-[#0ECB81]/15 z-0" style={{ width: `${bid.relativeSize}%` }}></div>
                            <span className="z-10 text-[#0ECB81] flex-1">{bid.price}</span>
                            <span className="z-10 text-[#EAECEF] flex-1 text-right group-hover:text-white">{bid.size}</span>
                            <span className="z-10 text-[#848E9C] flex-1 text-right">{bid.sum}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. TRADES SECTION (12rem height) */}
            <div className="h-[12rem] flex flex-col min-h-0 mt-0">
                {/* Header */}
                <div className="flex items-center px-3 py-1 border-b border-[#1E2026] shrink-0">
                    <span className="text-white font-bold text-sm font-sans">Trades</span>
                </div>

                {/* Column Headers */}
                <div className="flex justify-between px-3 py-1.5 text-[10px] text-[#848E9C] shrink-0">
                    <span className="flex-1">Price</span>
                    <span className="flex-1 text-right">Size</span>
                    <span className="flex-1 text-right pr-4">Time</span>
                </div>

                {/* Trades List (Full height of container minus headers, scrollable) */}
                <div className="h-full overflow-y-scroll custom-scroll">
                    {trades.map((trade, i) => (
                        <div key={i} className="flex px-3 py-[2px] hover:bg-[#1E2329] cursor-pointer group items-center shrink-0">
                            <span className={`flex-1 ${trade.side === 'buy' ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>{trade.price}</span>
                            <span className="flex-1 text-right text-[#EAECEF]">{trade.size}</span>
                            <div className="flex-1 flex justify-end items-center gap-2">
                                <span className="text-[#EAECEF]">{trade.time}</span>
                                <ExternalLink className="w-3 h-3 text-[#0ECB81]" />
                            </div>
                        </div>
                    ))}
                    {/* Repeat for visual fill */}
                    {trades.map((trade, i) => (
                        <div key={`dup-${i}`} className="flex px-3 py-[2px] hover:bg-[#1E2329] cursor-pointer group items-center shrink-0">
                            <span className={`flex-1 ${trade.side === 'buy' ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>{trade.price}</span>
                            <span className="flex-1 text-right text-[#EAECEF]">{trade.size}</span>
                            <div className="flex-1 flex justify-end items-center gap-2">
                                <span className="text-[#EAECEF]">{trade.time}</span>
                                <ExternalLink className="w-3 h-3 text-[#0ECB81]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
