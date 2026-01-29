import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const PAIRS = [
    {
        id: 'btc',
        slug: 'BTC-PERP',
        baseContent: '₿',
        baseColor: '#F7931A',
        price: '88,939.00',
        change: '-1.22 %',
        isNegative: true,
        volume: '145,744.29'
    },
    {
        id: 'eth',
        slug: 'ETH-PERP',
        baseContent: 'Ξ',
        baseColor: '#627EEA',
        price: '2,917.40',
        change: '-2.47 %',
        isNegative: true,
        volume: '93,248.48'
    },
    {
        id: 'sol',
        slug: 'SOL-PERP',
        baseContent: 'S',
        baseColor: '#14F195',
        price: '127.01',
        change: '-1.71 %',
        isNegative: true,
        volume: '13,263.01'
    },
    {
        id: 'apt',
        slug: 'APT-PERP',
        baseContent: '⌗',
        baseColor: '#FFFFFF',
        price: '1.57',
        change: '-0.19 %',
        isNegative: true,
        volume: '283,804.81'
    }
];

export default function TickerBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPair, setSelectedPair] = useState(PAIRS[0]);

    // Helper component for stat items
    const StatItem = ({ label, value, valueColor = "text-white", hasBorder = true }) => (
        <div className={`flex flex-col justify-center px-4 h-full ${hasBorder ? 'border-r border-[#1E2026]' : ''} min-w-fit`}>
            <span className="text-[#848E9C] text-[11px] font-medium leading-tight mb-0.5">{label}</span>
            <span className={`text-[13px] font-bold leading-tight font-mono ${valueColor}`}>{value}</span>
        </div>
    );

    const handleSelect = (pair) => {
        setSelectedPair(pair);
        setIsOpen(false);
    };

    return (
        <div className="h-[3.125rem] min-h-[3.125rem] bg-black border-b border-[#1E2026] flex items-center w-full relative z-20">
            {/* Pair Selector Container */}
            <div className="relative h-full z-50">
                {/* Trigger */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center pl-4 pr-4 h-full border-r border-[#1E2026] min-w-fit cursor-pointer hover:bg-[#1E2329] transition-colors group"
                >
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white mr-3 transition-colors"
                        style={{ backgroundColor: selectedPair.baseColor }}
                    >
                        <span className="font-bold text-lg shadow-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{selectedPair.baseContent}</span>
                    </div>
                    <span className="lg:min-w-[6rem] text-white font-bold text-lg mr-2 tracking-tight group-hover:text-[#3dd2e5] transition-colors">
                        {selectedPair.slug}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#848E9C] group-hover:text-white transition-colors duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <>
                        {/* Backdrop to close on click outside */}
                        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />

                        {/* Menu */}
                        <div className="absolute top-full left-0 mt-1 w-[420px] bg-[#1E2329] border border-[#2B3139] rounded-lg shadow-2xl z-50 overflow-hidden ring-1 ring-black/50">
                            {/* Header */}
                            <div className="flex items-center px-4 py-3 border-b border-[#2B3139] bg-[#1E2329]">
                                <span className="text-[#848E9C] text-xs font-semibold uppercase tracking-wider">Pair</span>
                                <div className="flex-1" />
                                <div className="w-32 text-right">
                                    <span className="text-[#848E9C] text-xs font-semibold uppercase tracking-wider">Price / 24h</span>
                                </div>
                                <div className="w-24 text-right">
                                    <span className="text-[#848E9C] text-xs font-semibold uppercase tracking-wider">Vol</span>
                                </div>
                            </div>

                            {/* List */}
                            <div className="max-h-[320px] overflow-y-auto py-1">
                                {PAIRS.map((pair) => (
                                    <div
                                        key={pair.id}
                                        onClick={() => handleSelect(pair)}
                                        className="flex items-center px-4 py-3 hover:bg-[#2B3139] cursor-pointer transition-colors group border-l-2 border-transparent hover:border-[#3dd2e5]"
                                    >
                                        {/* Pair Info */}
                                        <div className="flex items-center min-w-[140px]">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3"
                                                style={{ backgroundColor: pair.baseColor }}
                                            >
                                                <span className="font-bold text-sm shadow-sm">{pair.baseContent}</span>
                                            </div>
                                            <span className={`text-[15px] font-bold ${selectedPair.id === pair.id ? 'text-[#3dd2e5]' : 'text-white group-hover:text-[#3dd2e5]'} transition-colors`}>
                                                {pair.slug}
                                            </span>
                                        </div>

                                        {/* Spacer */}
                                        <div className="flex-1" />

                                        {/* Price & Change */}
                                        <div className="flex flex-col items-end w-32">
                                            <span className="text-white text-[14px] font-mono font-medium">{pair.price}</span>
                                            <span className={`text-[12px] font-mono ${pair.isNegative ? 'text-[#F6465D]' : 'text-[#0ECB81]'}`}>
                                                {pair.change}
                                            </span>
                                        </div>

                                        {/* Volume */}
                                        <div className="w-24 text-right pl-4">
                                            <span className="text-[#848E9C] text-[13px] font-mono group-hover:text-white transition-colors">
                                                {pair.volume}
                                                <span className="text-[10px] text-[#5E6673] ml-1">M</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Stats Grid - Scrollable */}
            <div className="flex-1 h-full overflow-x-auto no-scrollbar flex items-center">
                {/* Dynamically update stats based on selection just for visual consistency if desired, 
                    but purely strictly mimicking 'show that part this place' for the pair name is priority. 
                    I'll keep some static or basic mapping to make it look alive. */}
                <StatItem label="Mark" value={`$${selectedPair.price}`} />
                <StatItem label="24h change" value={selectedPair.change} valueColor={selectedPair.isNegative ? "text-[#F6465D]" : "text-[#0ECB81]"} />
                <StatItem label="Oracle Price" value={`$${selectedPair.price.replace('.', ',')}`} /> {/* Mock variation */}
                <StatItem label="24h volume" value={`$${selectedPair.volume}`} />
                <StatItem label="Funding" value="0.000236 %" />
                <StatItem label="Next Funding" value="37:55" hasBorder={false} />
            </div>
        </div>
    );
}
