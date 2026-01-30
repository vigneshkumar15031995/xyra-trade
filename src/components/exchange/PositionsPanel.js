import React, { useState, useEffect } from 'react';
import {
    getPositions,
    getOpenOrders,
    getOrderHistory,
    getTradeHistory,
    getFills,
    getMarketSymbol
} from '../../utils/xyraApi';

const ORDER_TYPES = {
    1: 'Open Long',
    2: 'Open Short',
    3: 'Increase Long',
    4: 'Increase Short',
    5: 'Decrease Long',
    6: 'Decrease Short',
    7: 'Close Long',
    8: 'Close Short'
};

const getOrderTypeLabel = (type) => ORDER_TYPES[type] || 'Unknown';

const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    // If timestamp is in seconds (e.g. 174...), multiply by 1000
    const ts = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
    return new Date(ts).toLocaleString();
};


export default function PositionsPanel() {
    const tabs = [
        'Positions',
        'Open Orders',
        'Order History',
        'Trade History',
        'Funding History',
        'Deposit/Withdraw History'
    ];
    const [activeTab, setActiveTab] = useState('Positions');
    const [data, setData] = useState({
        positions: [],
        openOrders: [],
        orderHistory: [],
        tradeHistory: [],
        fundingHistory: [],
        deposits: []
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userAddress = '0x1234567890123456789012345678901234567890';
                // TODO: Hard code user address for now

                let newData = { ...data };

                switch (activeTab) {
                    case 'Positions':
                        const positions = await getPositions(userAddress);
                        newData.positions = positions;
                        break;
                    case 'Open Orders':
                        const openOrders = await getOpenOrders(userAddress);
                        newData.openOrders = openOrders;
                        break;
                    case 'Order History':
                        const orderHistory = await getOrderHistory(userAddress);
                        newData.orderHistory = orderHistory;
                        break;
                    case 'Trade History':
                        const tradeHistory = await getTradeHistory(userAddress);
                        newData.tradeHistory = tradeHistory;
                        break;
                    case 'Funding History':
                        const fills = await getFills(userAddress);
                        // Assuming fills can be used as funding/execution history
                        newData.fundingHistory = fills;
                        break;
                    default:
                        break;
                }
                setData(newData);
            } catch (error) {
                console.error("Failed to fetch panel data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center text-brand-text-secondary min-h-[150px]">
                    <span className="text-[0.75rem] animate-pulse">Loading data...</span>
                </div>
            );
        }

        switch (activeTab) {
            case 'Positions':
                return (
                    <div className="min-w-[1000px] w-full">
                        {/* Header */}
                        <div className="flex !py-[0rem] flex-row border-b-[rgba(255,255,255,0.10)] !px-[1rem] border-r-transparent border-l-transparent border-t-transparent border border-solid !bg-[#121414] justify-between items-center w-full flex-1">
                            <div className="!py-[0.5rem] flex w-[7%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate">Symbol</div></div>
                            <div className="!py-[0.5rem] flex w-[7%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate">Size</div></div>
                            <div className="!py-[0.5rem] flex w-[8%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate flex flex-row items-center gap-[0.25rem]">Value <div className="text-[0.625rem] font-[400] text-[rgba(255,255,255,0.40)]">(USDT)</div></div></div>
                            <div className="!py-[0.5rem] flex w-[10%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate flex flex-row items-center gap-[0.25rem]">Entry Price <div className="text-[0.625rem] font-[400] text-[rgba(255,255,255,0.40)]">(USDT)</div></div></div>
                            <div className="!py-[0.5rem] flex w-[9%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate flex flex-row items-center gap-[0.25rem]">Liq. Price <div className="text-[0.625rem] font-[400] text-[rgba(255,255,255,0.40)]">(USDT)</div></div></div>
                            <div className="!py-[0.5rem] flex w-[10.5%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate flex flex-row items-center gap-[0.125rem]">Oracle Price<div className="text-[0.625rem] font-[400] text-[rgba(255,255,255,0.40)]">(USDT)</div></div></div>
                            <div className="!py-[0.5rem] flex w-[9%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate flex flex-row items-center gap-[0.25rem]">Margin<div className="text-[0.625rem] font-[400] text-[rgba(255,255,255,0.40)]">(USDT)</div></div></div>
                            <div className="!py-[0.5rem] flex w-[9.5%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate flex flex-row items-center gap-[0.25rem]">Best Price<div className="text-[0.625rem] font-[400] text-[rgba(255,255,255,0.40)]">(USDT)</div></div></div>
                            <div className="!py-[0.5rem] flex w-[9.5%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate flex flex-row items-center gap-[0.25rem]">PnL<div className="text-[0.625rem] font-[400] text-[rgba(255,255,255,0.40)]">(USDT)</div></div></div>
                            <div className="!py-[0.5rem] flex w-[9%] text-[#A5A5A6] text-[0.625rem] justify-start text-left items-center"><div className="truncate">TP/SL</div></div>
                            <div className="w-[12%] flex flex-row justify-start items-center"><div className="truncate text-[#A5A5A6] text-[0.625rem]">Actions</div></div>
                        </div>

                        {data.positions.map((pos, idx) => (
                            <div key={idx} className="flex flex-row border-t-[rgba(255,255,255,0.10)] bg-transparent gap-0 p-4 items-center border-[1px] border-r-transparent border-l-transparent border-b-transparent w-full">
                                {/* Symbol */}
                                <div className="flex w-[7%] bg-transparent flex-row items-center justify-start">
                                    <div className="flex gap-1 bg-transparent justify-start flex-col items-start text-[0.75rem]">
                                        <div className="cursor-pointer text-[0.75rem] text-[rgba(255,255,255,0.80)] flex flex-row justify-start items-center gap-[0.5rem] manrope font-[400] w-full">
                                            {/* Placeholder for Icon */}
                                            <div className="h-4 w-4 bg-white rounded-full flex items-center justify-center text-[8px] text-black font-bold">{getMarketSymbol(pos.market_id)?.[0]}</div>
                                            {getMarketSymbol(pos.market_id)}
                                        </div>
                                        <button className={`text-[0.625rem] text-center ${pos.trade_side ? 'text-[#12B76A]' : 'text-[#F04438]'} flex flex-row justify-start items-center gap-[0.25rem]`}>
                                            <div className="text-[#A5A5A6] flex flex-row justify-start items-center">{pos.leverage}x</div>
                                            <div className="w-[2px] bg-[#A5A5A6] h-[2px] rounded-full"></div>
                                            <div>{pos.trade_side ? 'Long' : 'Short'}</div>
                                        </button>
                                    </div>
                                </div>
                                {/* Size */}
                                <div className="flex w-[7%] bg-transparent flex-row items-center justify-between">
                                    <div className="flex gap-1 bg-transparent justify-start flex-col items-start text-[0.75rem]">
                                        <div className="text-[0.75rem] text-[rgba(255,255,255,0.80)] manrope font-[400] w-full">{pos.size}</div>
                                        <button className="text-[0.625rem] text-center text-[#A5A5A6]">{getMarketSymbol(pos.market_id)}</button>
                                    </div>
                                </div>
                                {/* Value */}
                                <div className="flex w-[8%] bg-transparent flex-row items-center justify-between">
                                    <div className="flex gap-1 bg-transparent justify-start flex-col items-start text-[0.75rem]">
                                        <div className="text-[0.75rem] text-[rgba(255,255,255,0.80)] manrope font-[400] w-full">{Number(pos.value || 0).toFixed(2)}</div>
                                    </div>
                                </div>
                                {/* Entry Price */}
                                <div className="flex w-[10%] bg-transparent flex-row items-center justify-between">
                                    <div className="flex gap-1 bg-transparent justify-start flex-col items-start text-[0.75rem]">
                                        <div className="text-[0.75rem] text-[rgba(255,255,255,0.80)] manrope font-[400] w-full">{Number(pos.entry_price || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</div>
                                    </div>
                                </div>
                                {/* Liq Price */}
                                <div className="flex w-[9%] bg-transparent flex-row items-center justify-between">
                                    <div className="flex gap-1 bg-transparent justify-start flex-col items-start text-[0.75rem]">
                                        <div className="text-[0.75rem] text-[rgba(255,255,255,0.80)] manrope font-[400] w-full">{pos.liq_price ? Number(pos.liq_price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : '-'}</div>
                                    </div>
                                </div>
                                {/* Oracle Price (Placeholder) */}
                                <div className="flex w-[10.5%] bg-transparent flex-row items-center justify-between">
                                    <div className="flex gap-1 bg-transparent justify-start flex-col items-start text-[0.75rem]">
                                        <div className="text-[0.75rem] text-[rgba(255,255,255,0.80)] manrope font-[400] w-full">{pos.oracle_price ? Number(pos.oracle_price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : '-'}</div>
                                    </div>
                                </div>
                                {/* Margin */}
                                <div className="flex w-[9%] items-start bg-transparent flex-row justify-between">
                                    <div className="flex gap-1 bg-transparent justify-start flex-col items-start text-[0.75rem]">
                                        <div className="text-[0.75rem] text-[rgba(255,255,255,0.80)] manrope font-[400] flex flex-row justify-start items-center gap-[0.25rem]">
                                            {Number(pos.margin || 0).toFixed(2)}
                                            <div className="flex text-[#2ED3B7] cursor-pointer flex-row justify-start items-center gap-[0.25rem] font-[700] text-[0.625rem]">Add</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Best Price (Placeholder - Matches Entry for now if missing) */}
                                <div className="flex w-[9.5%] items-start bg-transparent flex-row justify-between">
                                    <div className="flex flex-col items-start text-[0.75rem] gap-1 bg-transparent justify-start">
                                        <div className="text-[0.75rem] text-[rgba(255,255,255,0.80)] manrope font-[400] flex flex-row justify-start items-center gap-[0.25rem]">
                                            {Number(pos.entry_price || 0).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                                {/* PnL */}
                                <div className="flex w-[9%] items-start bg-transparent flex-row justify-between">
                                    <div className="w-full flex flex-col items-start text-[0.75rem] justify-start gap-1 bg-transparent">
                                        <div className={`text-[0.75rem] ${Number(pos.pnl) >= 0 ? 'text-[#12B76A]' : 'text-[#F04438]'} manrope flex flex-row justify-start items-center gap-[0.125rem]`}>
                                            <div>{Number(pos.pnl || 0).toFixed(2)}</div>
                                        </div>
                                        <div className={`${Number(pos.pnl) >= 0 ? 'text-[#12B76A]' : 'text-[#F04438]'} manrope text-[0.625rem] font-[400] flex flex-row justify-start items-center gap-[0.125rem]`}>
                                            ({pos.pnl_percentage || '0.00'} %)
                                        </div>
                                    </div>
                                </div>
                                {/* TP/SL */}
                                <div className="flex w-[9%] items-start bg-transparent flex-row justify-between">
                                    <div className="flex-col items-start text-[0.75rem] justify-start flex gap-1 bg-transparent">
                                        <div className="text-[#777879] manrope font-[400] flex flex-row items-center gap-1 bg-transparent text-[0.75rem] justify-start">
                                            TP<span> -</span>
                                            <div className="outline-none bg-transparent text-left text-[#FFF] flex flex-row justify-start items-start">{pos.tp ? Number(pos.tp).toFixed(2) : '0.00'}</div>
                                            <div className="flex cursor-pointer flex-row text-[#2ED3B7] justify-start items-start w-[1.5rem] font-[700] text-[0.625rem]">Edit</div>
                                        </div>
                                        <div className="text-[#777879] manrope font-[400] items-center flex flex-row gap-1 text-[0.75rem] justify-start bg-transparent">
                                            SL<span> -</span>
                                            <div className="outline-none bg-transparent text-left text-[#FFF] flex flex-row justify-start items-start">{pos.sl ? Number(pos.sl).toFixed(2) : '0.00'}</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex w-[12%] bg-transparent flex-row items-start justify-start">
                                    <div className="flex bg-transparent flex-row gap-[1rem] items-start justify-start w-full">
                                        <div className="flex flex-col items-start w-[45%] gap-[0.4rem] justify-start">
                                            <button className="font-[600] flex flex-row justify-start items-center border-[#2ED3B7] text-[#2ED3B7] bg-transparent flex-[0.5] h-full leading-[normal] rounded-lg text-left text-[0.75rem] cursor-pointer">Limit</button>
                                            <button className="font-[600] flex flex-row justify-start items-center border-[#2ED3B7] text-[#2ED3B7] bg-transparent flex-[0.5] h-full leading-[normal] rounded-lg text-left text-[0.75rem] cursor-pointer">Market</button>
                                        </div>
                                        <div className="flex flex-col items-start w-[55%] gap-[0.4rem] justify-start">
                                            <button className="font-[600] border-[#2ED3B7] text-[#2ED3B7] flex flex-row justify-start items-start gap-[0.25rem] bg-transparent flex-[0.5] h-full leading-[normal] rounded-lg text-left text-[0.75rem] cursor-pointer"><div>Quick</div><div> Close</div></button>
                                            <button className="font-[600] flex flex-row justify-center items-center gap-[0.25rem] bg-transparent flex-[0.5] h-full leading-[normal] rounded-lg text-center text-[0.75rem] border-[#2ED3B7] text-[#2ED3B7] cursor-pointer"><div>Reverse</div></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-[4%] bg-transparent flex-row items-center justify-center">
                                    <div className="flex bg-transparent flex-row items-center justify-center w-full">
                                        <div className="flex cursor-pointer flex-row bg-transparent items-center justify-center w-fit h-full text-[#A5A5A6]">
                                            Share
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Open Orders':
                return (
                    <div className="flex flex-col h-full min-w-[800px]">
                        <div className="grid grid-cols-9 border-b border-brand-border bg-brand-bg sticky top-0 py-2 px-4 z-10 text-[0.62rem] font-medium text-brand-text-secondary">
                            {['Symbol', 'Time', 'Type', 'Side', 'Price', 'Amount', 'Value', 'Status', 'Action'].map((h, i) => (
                                <div key={i} className={`${i === 0 ? 'text-left' : 'text-right'}`}>{h}</div>
                            ))}
                        </div>
                        {(!data.openOrders || data.openOrders.length === 0) ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-brand-text-secondary min-h-[100px]">
                                <span className="text-[0.75rem]">No Open Orders</span>
                            </div>
                        ) : (
                            data.openOrders.map((order, idx) => (
                                <div key={idx} className="grid grid-cols-9 py-3 px-4 border-b border-brand-border hover:bg-brand-surface/30 items-center">
                                    <div className="text-left font-bold text-white text-[0.7rem]">{getMarketSymbol(order.market_id)}</div>
                                    <div className="text-right text-brand-text-secondary text-[0.65rem]">-</div>
                                    <div className="text-right text-brand-text-primary text-[0.7rem]">{getOrderTypeLabel(order.order_type)}</div>
                                    <div className={`text-right text-[0.7rem] text-brand-green`}>-</div>
                                    <div className="text-right text-brand-text-primary text-[0.7rem]">{order.price}</div>
                                    <div className="text-right text-brand-text-primary text-[0.7rem]">{order.remaining_size} / {order.total_size}</div>
                                    <div className="text-right text-brand-text-primary text-[0.7rem]">{order.order_value}</div>
                                    <div className="text-right text-brand-green text-[0.7rem]">Open</div>
                                    <div className="text-right text-brand-accent text-[0.7rem] cursor-pointer">Cancel</div>
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'Order History':
                return (
                    <div className="min-w-[1000px]">
                        <div className="grid grid-cols-9 border-b border-brand-border bg-brand-bg sticky top-0 py-2 px-4 z-10 text-[0.62rem] font-medium text-brand-text-secondary">
                            {['Symbol', 'Time', 'Order Type', 'Leverage', 'Size', 'Price (USDT)', 'Order Value (USDT)', 'Status', 'Order ID'].map((h, i) => (
                                <div key={i} className={`${i === 0 ? 'text-left' : 'text-right'}`}>{h}</div>
                            ))}
                        </div>
                        {data.orderHistory.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-9 py-3 px-4 border-b border-brand-border hover:bg-brand-surface/30 items-center">
                                <div className="text-left font-bold text-white text-[0.7rem]">{getMarketSymbol(item.market_id)}</div>
                                <div className="text-right text-[0.65rem] text-brand-text-secondary">{formatDate(item.timestamp)}</div>
                                <div className="text-right text-[0.7rem] text-brand-text-primary">{getOrderTypeLabel(item.order_type)}</div>
                                <div className="text-right text-[0.7rem] text-brand-text-primary">{item.leverage}x</div>
                                <div className="text-right text-[0.7rem] text-brand-text-primary">{item.size}</div>
                                <div className="text-right text-[0.7rem] text-brand-text-primary">{item.price}</div>
                                <div className="text-right text-[0.7rem] text-brand-text-primary">{item.order_value}</div>
                                <div className={`text-right text-[0.7rem] ${item.status === 'Cancelled' ? 'text-brand-text-secondary' : 'text-brand-green'}`}>{item.status || 'Filled'}</div>
                                <div className="text-right text-[0.7rem] text-brand-text-secondary">{item.order_id?.substring(0, 8)}...</div>
                            </div>
                        ))}
                    </div>
                );
            case 'Trade History':
                return (
                    <div className="min-w-[1000px]">
                        <div className="grid grid-cols-7 border-b border-brand-border bg-brand-bg sticky top-0 py-2 px-4 z-10 text-[0.62rem] font-medium text-brand-text-secondary">
                            {['Symbol', 'Time', 'Leverage', 'Size', 'Price (USDT)', 'Fee (USDT)', 'PnL (USDT)'].map((h, i) => (
                                <div key={i} className={`${i === 0 ? 'text-left' : 'text-right'}`}>{h}</div>
                            ))}
                        </div>
                        {data.tradeHistory.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-7 py-3 px-4 border-b border-brand-border hover:bg-brand-surface/30 items-center">
                                <div className="text-left font-bold text-white text-[0.7rem]">{getMarketSymbol(item.market_id)}</div>
                                <div className="text-right text-[0.65rem] text-brand-text-secondary">{formatDate(item.timestamp)}</div>
                                <div className="text-right text-[0.7rem] text-brand-text-primary">{item.leverage}x</div>
                                <div className="text-right text-[0.7rem] text-brand-text-primary">{item.size}</div>
                                <div className="text-right text-[0.7rem] text-brand-text-primary">{item.price}</div>
                                <div className="text-right text-[0.7rem] text-brand-text-primary">{item.fee}</div>
                                <div className={`text-right text-[0.7rem] ${item.pnl?.startsWith('-') ? 'text-brand-red' : 'text-brand-green'}`}>{item.pnl}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'Funding History':
                return (
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-6 border-b border-brand-border bg-brand-bg sticky top-0 py-2 px-4 z-10 text-[0.62rem] font-medium text-brand-text-secondary">
                            {['Symbol', 'Time', 'Size', 'Direction', 'Funding Rate (%)', 'Payment (USDT)'].map((h, i) => (
                                <div key={i} className={`${i === 0 ? 'text-left' : 'text-right'}`}>{h}</div>
                            ))}
                        </div>
                        {(!data.fundingHistory || data.fundingHistory.length === 0) ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-brand-text-secondary min-h-[100px]">
                                <span className="text-[0.75rem]">No Funding History</span>
                            </div>
                        ) : (
                            data.fundingHistory.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-6 py-3 px-4 border-b border-brand-border hover:bg-brand-surface/30 items-center">
                                    <div className="flex items-center gap-2 text-left">
                                        <span className="text-[0.7rem] font-bold text-brand-text-primary">{item.symbol || 'BTC'}</span>
                                    </div>
                                    <div className="text-right text-[0.7rem] text-brand-text-primary flex flex-col items-end">
                                        <span>{formatDate(item.time || item.timestamp).split(',')[0]}</span>
                                        <span className="text-brand-text-secondary text-[0.6rem]">{formatDate(item.time || item.timestamp).split(',')[1]}</span>
                                    </div>
                                    <div className="text-right text-[0.7rem] text-brand-text-primary">{item.size}</div>
                                    <div className="text-right text-[0.7rem] text-brand-green">{item.side}</div>
                                    <div className="text-right text-[0.7rem] text-brand-text-primary">{item.rate}</div>
                                    <div className="text-right text-[0.7rem] text-brand-text-primary">{item.payment}</div>
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'Deposit/Withdraw History':
                return (
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-4 border-b border-brand-border bg-brand-bg sticky top-0 py-2 px-4 z-10 text-[0.62rem] font-medium text-brand-text-secondary">
                            {['Timestamp', 'Type', 'Amount (USDT)', 'Txn ID'].map((h, i) => (
                                <div key={i} className={`${i === 0 ? 'text-left' : 'text-right'}`}>{h}</div>
                            ))}
                        </div>
                        {(!data.deposits || data.deposits.length === 0) ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-brand-text-secondary min-h-[100px]">
                                <span className="text-[0.75rem]">No Deposit History</span>
                            </div>
                        ) : (
                            data.deposits.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-4 py-3 px-4 border-b border-brand-border hover:bg-brand-surface/30 items-center">
                                    <div className="text-left text-[0.7rem] text-brand-text-primary flex flex-col">
                                        <span>{formatDate(item.time || item.timestamp).split(',')[0]}</span>
                                        <span className="text-brand-text-secondary text-[0.6rem]">{formatDate(item.time || item.timestamp).split(',')[1]}</span>
                                    </div>
                                    <div className="text-right text-[0.7rem] text-brand-green">{item.type}</div>
                                    <div className="text-right text-[0.7rem] text-brand-text-primary">{item.amount}</div>
                                    <div className="text-right text-[0.7rem] text-brand-green cursor-pointer flex items-center justify-end gap-1">
                                        {item.txId} <span className="text-[0.6rem]">🔗</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-brand-bg border-t border-brand-border h-[400px]">
            {/* Tabs */}
            <div className="flex items-center gap-6 px-4 border-b border-brand-border h-[40px] shrink-0 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`h-full text-[0.7rem] font-semibold border-b-2 transition-colors whitespace-nowrap px-1 ${activeTab === tab
                            ? 'text-brand-text-primary border-brand-accent'
                            : 'text-brand-text-secondary border-transparent hover:text-brand-text-primary'
                            }`}
                    >
                        {tab}
                        {tab === 'Positions' && <span className="ml-2 text-[0.6rem] bg-brand-surface text-brand-text-secondary px-1.5 py-0.5 rounded">3</span>}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-brand-bg relative">
                {renderContent()}
            </div>
        </div>
    );
}
