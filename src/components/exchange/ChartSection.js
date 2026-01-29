import React from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

export default function ChartSection() {
    return (
        <div className="flex flex-col h-full w-full bg-black border-r border-[#1E2026] overflow-hidden">
            <div className="flex-1 w-full h-full">
                <AdvancedRealTimeChart
                    theme="dark"
                    autosize
                    symbol="BINANCE:BTCUSDT"
                    interval="15"
                    timezone="Etc/UTC"
                    style="1"
                    locale="en"
                    toolbar_bg="#1E2329"
                    enable_publishing={false}
                    hide_top_toolbar={false}
                    hide_side_toolbar={false}
                    allow_symbol_change={true}
                    container_id="tradingview_widget"
                    copyrightStyles={{ parent: { fontSize: '0px' }, link: { display: 'none' }, span: { display: 'none' } }}
                />
            </div>
        </div>
    );
}
