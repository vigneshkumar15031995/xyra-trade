import { placeOrder, getWalletBalance, getProfileBalance, getPositions, getMarketInfo } from '../../utils/xyraApi';
import { ArrowLeftRight, Info, Download, Upload } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import FundsTransferModal from './FundsTransferModal';
import BigNumber from 'bignumber.js';

export default function TradeForm() {
    const [side, setSide] = useState('buy'); // buy | sell
    const [mode, setMode] = useState('market'); // market | limit
    const [leverage, setLeverage] = useState(1);
    const [maxLeverage, setMaxLeverage] = useState(20); // Default to 20, update from API
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('89904');
    const [marginType, setMarginType] = useState('Isolated');
    const [tab, setTab] = useState('Open'); // Open | Close
    const [sliderValue, setSliderValue] = useState(0);
    const [tpSlEnabled, setTpSlEnabled] = useState(false);
    const [tpSlSide, setTpSlSide] = useState('long');
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [transferTab, setTransferTab] = useState('deposit');
    // amountCurrency managed by tab effect now
    const [amountCurrency, setAmountCurrency] = useState('USDT');
    const [tpValue, setTpValue] = useState('');
    const [slValue, setSlValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [profileBalance, setProfileBalance] = useState(0);
    const [positions, setPositions] = useState([]);

    // --- Effects ---

    // 1. Fetch Data on Mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Get Market Info (BTC ID 15)
            const mInfo = await getMarketInfo(15);
            console.log("Fetched Market Info:", mInfo);
            if (mInfo) {
                console.log("Fetched Market Info:", mInfo);
                if (mInfo.max_leverage) {
                    setMaxLeverage(Number(mInfo.max_leverage));
                }
            }

            // Get Balances
            const wBal = await getWalletBalance();
            setWalletBalance(wBal);

            const userAddress = process.env.NEXT_PUBLIC_XYRA_USER_ADDRESS;
            if (userAddress) {
                const pBal = await getProfileBalance(userAddress);
                console.log("Profile Balance", pBal);
                setProfileBalance(pBal);

                // Get Positions (for Close validation)
                const currentPositions = await getPositions(userAddress);
                setPositions(currentPositions || []);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    // 2. Tab Change Logic: Set Default Currency but allow toggle
    useEffect(() => {
        if (tab === 'Open') {
            setAmountCurrency('USDT'); // Default Margin
        } else {
            setAmountCurrency('BTC'); // Default Position Size
        }
        setAmount(''); // Reset amount on tab switch
    }, [tab]);

    // 3. Slider Logic (Percentage of Max Available)
    useEffect(() => {
        if (!sliderValue) return;

        if (tab === 'Open') {
            const maxMargin = Number(profileBalance);
            if (maxMargin > 0) {
                // If Currency is USDT (Margin), use % of Balance directly
                // If Currency is BTC (Size), calculate Size = (%Balance * Lev) / Price
                if (amountCurrency === 'USDT') {
                    const calcAmount = (maxMargin * sliderValue) / 100;
                    setAmount(calcAmount.toFixed(2));
                } else {
                    const execPrice = Number(price) || 0;
                    if (execPrice > 0) {
                        const marginToUse = (maxMargin * sliderValue) / 100;
                        const calcSize = (marginToUse * leverage) / execPrice;
                        setAmount(calcSize.toFixed(6));
                    }
                }
            }
        } else {
            const btcPosition = positions.find(p => String(p.market_id) === '15'); // 15 = BTC
            if (btcPosition) {
                const size = Math.abs(Number(btcPosition.size));

                // If Currency is BTC (Size), use % of Size directly
                // If Currency is USDT (Value), calculate Value = (%Size * Price)
                if (amountCurrency === 'BTC') {
                    const calcSize = (size * sliderValue) / 100;
                    setAmount(calcSize.toFixed(6));
                } else {
                    const execPrice = Number(price) || 0;
                    if (execPrice > 0) {
                        const sizeToUse = (size * sliderValue) / 100;
                        const calcValue = sizeToUse * execPrice;
                        setAmount(calcValue.toFixed(2));
                    }
                }
            }
        }
    }, [sliderValue, tab, profileBalance, positions, amountCurrency, leverage, price]);


    const handleOrder = async (btnSide) => {
        // btnSide: 'buy' or 'sell'

        if (!amount || Number(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const isClose = tab === 'Close';
        const execPrice = Number(price) || 0;
        if (execPrice <= 0) {
            alert('Invalid Price');
            return;
        }

        // --- 1. Calculate Standardized Size (BTC) ---
        let finalSize = 0;
        if (amountCurrency === 'BTC') {
            finalSize = Number(amount);
        } else {
            // Input is USDT
            if (!isClose) {
                // Open Mode: Input is MARGIN (USDT)
                // Size = (Margin * Lev) / Price
                finalSize = (Number(amount) * leverage) / execPrice;
            } else {
                // Close Mode: Input is NOTIONAL VALUE (USDT)
                // Size = Value / Price
                finalSize = Number(amount) / execPrice;
            }
        }

        // --- 2. Validation ---
        if (!isClose) {
            // OPEN Order Validation: Check Cost vs Balance
            // Cost = (Size * Price) / Leverage
            const estimatedCost = (finalSize * execPrice) / leverage;

            if (estimatedCost > Number(profileBalance)) {
                alert(`Insufficient Profile Balance. Required: ${estimatedCost.toFixed(2)} USDT, Avail: ${Number(profileBalance).toFixed(2)} USDT`);
                return;
            }
        } else {
            // CLOSE Order Validation: Check Size vs Position
            const btcPosition = positions.find(p => String(p.market_id) === '15');
            if (!btcPosition) {
                alert('No open BTC position to close');
                return;
            }

            const posSize = Math.abs(Number(btcPosition.size));
            if (finalSize > posSize * 1.01) { // 1% buffer for rounding? Or strict? Strict is better but floats...
                alert(`Cannot close more than open position size (${posSize.toFixed(6)} BTC). Your order: ${finalSize.toFixed(6)} BTC`);
                return;
            }
        }


        setIsSubmitting(true);
        try {
            console.log("Placing order...", {
                isClose,
                side: btnSide,
                inputAmount: amount,
                inputCurrency: amountCurrency,
                calculatedSize: finalSize,
                price: execPrice,
                leverage
            });

            await placeOrder({
                marketSymbol: 'BTC',
                side: btnSide,
                type: mode,
                size: finalSize.toFixed(6), // Ensure string format
                price: price, // For Limit orders
                leverage: leverage,
                takeProfit: tpSlEnabled && tpValue ? tpValue : 0,
                stopLoss: tpSlEnabled && slValue ? slValue : 0,
                isClose: isClose
            });

            alert('Order placed successfully!');
            fetchData(); // Refresh balances/positions
            setAmount('');
            setSliderValue(0);

        } catch (error) {
            console.error(error);
            alert('Failed to place order: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Dynamic Calculations for Summary Grid ---
    const calculateSummary = () => {
        const execPrice = Number(price) || 0;
        const lev = Number(leverage) || 1;
        const inputVal = Number(amount) || 0;

        let posSizeBTC = 0;
        let posValueUSDT = 0;
        let requiredMargin = 0;

        if (execPrice > 0 && inputVal > 0) {
            if (amountCurrency === 'USDT') {
                // Input is Margin (Open) or Value (Close -> treated as Value for Open sim)
                // For Open Tab: Input is Margin.
                // For Close Tab: Input is Value.

                if (tab === 'Open') {
                    requiredMargin = inputVal;
                    posValueUSDT = inputVal * lev;
                    posSizeBTC = posValueUSDT / execPrice;
                } else {
                    // Close Tab (Value Input)
                    posValueUSDT = inputVal;
                    posSizeBTC = posValueUSDT / execPrice;
                    requiredMargin = posValueUSDT / lev;
                }
            } else {
                // Input is BTC (Size)
                posSizeBTC = inputVal;
                posValueUSDT = posSizeBTC * execPrice;
                requiredMargin = posValueUSDT / lev;
            }
        }

        // Liq Price Constants (Approx)
        // MMR (Maintenance Margin Rate) - assuming 0.5% (0.005) standard for BTC
        const MMR = 0.005;

        // Liq Price Long = Entry * (1 - (1/Lev - MMR))
        const liqPriceLong = execPrice > 0 ? execPrice * (1 - (1 / lev - MMR)) : 0;

        // Liq Price Short = Entry * (1 + (1/Lev - MMR))
        const liqPriceShort = execPrice > 0 ? execPrice * (1 + (1 / lev - MMR)) : 0;

        return {
            btc: posSizeBTC,
            usdt: posValueUSDT,
            margin: requiredMargin,
            liqLong: liqPriceLong,
            liqShort: liqPriceShort
        };
    };

    const summary = calculateSummary();

    const activeColor = tab === 'Open' ? '#3dd2e5' : '#F6465D';

    return (
        <div className="flex flex-col h-full bg-black border-l border-[#1E2026]">
            {/* Header */}
            <div className="flex items-start justify-between px-3 py-2 border-b border-[#1E2026]">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[#848E9C] text-[10px] font-medium mb-0.5">Wallet Balance</span>
                        <span className="text-white text-xs font-bold font-mono">{Number(walletBalance).toFixed(2)} USDT</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#848E9C] text-[10px] font-medium mb-0.5">Profile Balance</span>
                        <span className="text-white text-xs font-bold font-mono">{Number(profileBalance).toFixed(2)} USDT</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setTransferTab('deposit'); setIsTransferModalOpen(true); }}
                        className="bg-[#1E2329] hover:bg-[#2A2E35] p-1.5 rounded text-[#848E9C] hover:text-white transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => { setTransferTab('withdraw'); setIsTransferModalOpen(true); }}
                        className="bg-[#1E2329] hover:bg-[#2A2E35] p-1.5 rounded text-[#848E9C] hover:text-white transition-colors"
                    >
                        <Upload className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Isolated / Hedge Mode */}
            <div className="flex px-3 py-2 gap-2">
                {['Isolated', 'Hedge'].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setMarginType(mode)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded border transition-all ${marginType === mode
                            ? 'bg-[#1E2329] border-[#2B3139] text-white shadow-sm'
                            : 'bg-transparent border-[#2B3139] text-[#848E9C] hover:text-white hover:border-[#848E9C]'
                            }`}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            {/* Open / Close Tabs */}
            <div className="flex h-[32px] border-b border-[#1E2026] mb-3">
                {['Open', 'Close'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 text-xs font-bold transition-all relative ${tab === t ? 'text-white' : 'text-[#848E9C] hover:text-[#EAECEF]'
                            }`}
                    >
                        {t}
                        {tab === t && (
                            <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${t === 'Open' ? 'bg-[#3dd2e5]' : 'bg-[#F6465D]'}`} />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-1 custom-scrollbar">

                {/* Market / Limit Tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setMode('market')}
                        className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${mode === 'market'
                            ? 'bg-[#1E2329] text-[#3dd2e5]'
                            : 'text-[#848E9C] hover:text-[#EAECEF]'
                            }`}
                    >
                        Market
                    </button>
                    <button
                        onClick={() => setMode('limit')}
                        className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${mode === 'limit'
                            ? 'bg-[#1E2329] text-[#3dd2e5]'
                            : 'text-[#848E9C] hover:text-[#EAECEF]'
                            }`}
                    >
                        Limit
                    </button>
                </div>

                {/* Leverage Slider */}
                <div className="mb-4 px-3 py-2 pl-5 border border-[#2B3139] rounded-lg flex items-center justify-between bg-[#0B0E11]">
                    <div className="flex-1 relative h-5 flex items-center mr-4 group">
                        <input
                            type="range"
                            min="1"
                            max={maxLeverage}
                            step="1"
                            value={leverage}
                            onChange={(e) => setLeverage(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                        />
                        <div className="absolute left-0 right-0 h-[4px] bg-[#2B3139] rounded-full z-0 pointer-events-none"></div>
                        <div
                            className="absolute left-0 h-[4px] bg-[#3dd2e5] rounded-l-full z-0 pointer-events-none transition-all duration-75 ease-out"
                            style={{ width: `${((leverage - 1) / (maxLeverage - 1)) * 100}%` }}
                        ></div>
                        {[1, Math.round(maxLeverage * 0.25), Math.round(maxLeverage * 0.5), Math.round(maxLeverage * 0.75), maxLeverage].map((tick) => (
                            <div
                                key={tick}
                                className={`absolute w-2.5 h-2.5 rounded-full z-10 pointer-events-none transition-colors ${leverage >= tick ? 'bg-[#3dd2e5] border-2 border-[#0B0E11]' : 'bg-[#EAECEF]'
                                    }`}
                                style={{ left: `${((tick - 1) / (maxLeverage - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                            />
                        ))}
                        <div
                            className="absolute w-6 h-6 rounded-full bg-[#3dd2e5]/30 flex items-center justify-center z-20 pointer-events-none transition-all duration-75 ease-out"
                            style={{ left: `${((leverage - 1) / (maxLeverage - 1)) * 100}%`, transform: 'translateX(-50%)' }}
                        >
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>

                    <div className="w-12 h-7 bg-black border border-[#2B3139] rounded flex items-center justify-center px-1 focus-within:border-[#3dd2e5] transition-colors relative">
                        <input
                            type="number"
                            min="1"
                            max={maxLeverage}
                            value={leverage}
                            onChange={(e) => {
                                let val = parseInt(e.target.value);
                                if (!isNaN(val)) {
                                    if (val > maxLeverage) val = maxLeverage;
                                    if (val < 1) val = 1;
                                    setLeverage(val);
                                } else {
                                    setLeverage('')
                                }
                            }}
                            onBlur={() => {
                                if (leverage === '' || leverage < 1) setLeverage(1);
                            }}
                            className="w-full bg-transparent text-white font-bold text-xs text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 z-10"
                        />
                        <span className="absolute right-1 text-[#848E9C] text-[10px] font-bold pointer-events-none">x</span>
                    </div>
                </div>

                {/* Limit Price Input (Only show if Limit) */}
                {mode === 'limit' && (
                    <div className="mb-3">
                        <div className="flex justify-between text-[10px] text-[#848E9C] mb-1">
                            <span>Price</span>
                            <span className="text-[#3dd2e5] font-bold cursor-pointer">Mid</span>
                        </div>
                        <div className="bg-[#0B0E11] rounded border border-[#3dd2e5] h-8 flex items-center px-2 justify-between">
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="bg-transparent text-sm text-white font-mono focus:outline-none w-full"
                            />
                            <span className="text-[10px] font-bold text-white">USDT</span>
                        </div>
                    </div>
                )}

                {/* Amount Input */}
                <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-[#848E9C] mb-1">
                        <span>
                            {tab === 'Open'
                                ? (amountCurrency === 'USDT' ? 'Margin' : 'Size (BTC)')
                                : (amountCurrency === 'BTC' ? 'Size' : 'Value (USDT)')
                            }
                        </span>
                        {tab === 'Open' && <span className="text-[#848E9C]">Avail: <span className="text-white">{Number(profileBalance).toFixed(2)} USDT</span></span>}
                    </div>
                    <div className="bg-[#0B0E11] rounded border border-[#2B3139] hover:border-[#848E9C] focus-within:border-[#3dd2e5] transition-colors h-9 flex items-center px-2 justify-between">
                        <input
                            type="text"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-transparent text-sm text-white font-mono focus:outline-none w-full placeholder-[#474D57]"
                        />
                        {/* Enabled currency toggle */}
                        <div
                            className="flex items-center gap-1.5 shrink-0 p-1 rounded transition-colors cursor-pointer hover:bg-[#1E2329]"
                            onClick={() => setAmountCurrency(prev => prev === 'BTC' ? 'USDT' : 'BTC')}
                        >
                            <span className="text-[10px] font-bold text-white">{amountCurrency}</span>
                            <ArrowLeftRight className="w-3 h-3 text-[#848E9C]" />
                        </div>
                    </div>
                </div>
                {/* Percentage Slider */}
                <div className="mb-4 px-3 py-2 border border-[#2B3139] rounded-lg flex items-center justify-between bg-[#0B0E11]">
                    <div className="flex-1 relative h-5 flex items-center mr-4 group">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="25"
                            value={sliderValue}
                            onChange={(e) => setSliderValue(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 z-50 cursor-pointer"
                        />
                        <div className="absolute left-0 right-0 h-[3px] bg-[#2B3139] rounded-full z-0 pointer-events-none"></div>
                        <div
                            className="absolute left-0 h-[3px] bg-[#3dd2e5] rounded-l-full z-0 pointer-events-none"
                            style={{ width: `${sliderValue}%` }}
                        ></div>
                        <div
                            className="absolute w-3.5 h-3.5 rounded-full bg-[#EAECEF] border border-[#0B0E11] shadow-lg z-20 pointer-events-none transition-transform duration-75 ease-out group-hover:scale-110"
                            style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}
                        ></div>
                    </div>
                    <div className="w-10 h-7 bg-[#181a1f] border border-[#2B3139] rounded text-white text-[10px] font-bold flex items-center justify-center">
                        {sliderValue}%
                    </div>
                </div>

                {/* Buy / Sell Mock Info */}
                <div className="flex justify-between text-[10px] font-bold mb-3">
                    <span className="text-[#848E9C]">Buy <span className="text-white">0.00 {amountCurrency}</span></span>
                    <span className="text-[#848E9C]">Sell <span className="text-white">0.00 {amountCurrency}</span></span>
                </div>

                {/* TP/SL Advanced Section */}
                <div className="mb-4 p-3 bg-[#0B0E11] rounded-lg border border-[#2B3139]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTpSlEnabled(!tpSlEnabled)}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${tpSlEnabled
                                ? 'bg-[#3dd2e5] border-[#3dd2e5]'
                                : 'bg-[#1E2329] border-[#2B3139] hover:border-[#848E9C]'
                                }`}>
                                {tpSlEnabled && (
                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-[11px] font-bold text-white select-none">TP/SL</span>
                        </div>

                        {tpSlEnabled && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTpSlSide('long')}
                                    className={`text-[10px] font-bold transition-colors ${tpSlSide === 'long' ? 'text-[#3dd2e5]' : 'text-[#848E9C] hover:text-[#EAECEF]'}`}
                                >
                                    Long
                                </button>
                                <button
                                    onClick={() => setTpSlSide('short')}
                                    className={`text-[10px] font-bold transition-colors ${tpSlSide === 'short' ? 'text-[#3dd2e5]' : 'text-[#848E9C] hover:text-[#EAECEF]'}`}
                                >
                                    Short
                                </button>
                            </div>
                        )}
                    </div>

                    {tpSlEnabled && (
                        <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                            {/* Take Profit Row */}
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black border border-[#2B3139] rounded h-8 flex items-center px-2 gap-2">
                                    <span className="text-[#848E9C] text-[11px]">TP</span>
                                    <input
                                        type="text"
                                        value={tpValue}
                                        onChange={(e) => setTpValue(e.target.value)}
                                        className="bg-transparent flex-1 w-full text-[11px] font-mono text-white text-right focus:outline-none"
                                    />
                                </div>
                                <div className="flex-1 bg-black border border-[#2B3139] rounded h-8 flex items-center px-2 gap-2">
                                    <div className="flex-1 flex items-center justify-between gap-1">
                                        <span className="text-[#848E9C] text-[11px]">Gain</span>
                                        <input type="text" className="bg-transparent w-full text-[11px] font-mono text-white text-right focus:outline-none" />
                                    </div>
                                    <span className="text-[#848E9C] text-[11px] font-bold">%</span>
                                </div>
                            </div>

                            {/* Expected PnL (Win) */}
                            <div className="flex justify-between text-[10px]">
                                <span className="text-[#848E9C]">Expected PnL :</span>
                                <span className="text-[#0ECB81] font-mono">0.00 USDT</span>
                            </div>

                            {/* Stop Loss Row */}
                            <div className="flex gap-2">
                                <div className="flex-1 bg-black border border-[#2B3139] rounded h-8 flex items-center px-2 gap-2">
                                    <span className="text-[#848E9C] text-[11px]">SL</span>
                                    <input
                                        type="text"
                                        value={slValue}
                                        onChange={(e) => setSlValue(e.target.value)}
                                        className="bg-transparent flex-1 w-full text-[11px] font-mono text-white text-right focus:outline-none"
                                    />
                                </div>
                                <div className="flex-1 bg-black border border-[#2B3139] rounded h-8 flex items-center px-2 gap-2">
                                    <div className="flex-1 flex items-center justify-between gap-1">
                                        <span className="text-[#848E9C] text-[11px]">Loss</span>
                                        <input type="text" className="bg-transparent w-full text-[11px] font-mono text-white text-right focus:outline-none" />
                                    </div>
                                    <span className="text-[#848E9C] text-[11px] font-bold">%</span>
                                </div>
                            </div>

                            {/* Expected PnL (Loss) */}
                            <div className="flex justify-between text-[10px]">
                                <span className="text-[#848E9C]">Expected PnL :</span>
                                <span className="text-[#F6465D] font-mono">0.00 USDT</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => handleOrder('buy')}
                        disabled={isSubmitting}
                        className={`flex-1 bg-[#0B0E11] text-[#3dd2e5] font-bold py-3 rounded-lg text-sm transition-all border border-[#3dd2e5] border-b-[3px] hover:brightness-110 active:border-b active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isSubmitting ? 'Processing...' : (tab === 'Open' ? 'Open Long' : 'Close Short')}
                    </button>
                    <button
                        onClick={() => handleOrder('sell')}
                        disabled={isSubmitting}
                        className={`flex-1 bg-[#0B0E11] text-[#F6465D] font-bold py-3 rounded-lg text-sm transition-all border border-[#F6465D] border-b-[3px] hover:brightness-110 active:border-b active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isSubmitting ? 'Processing...' : (tab === 'Open' ? 'Open Short' : 'Close Long')}
                    </button>

                    {/* 
                     NOTE on Close Logic Buttons:
                     - Closing a Long Position requires Selling (Short direction order).
                     - Closing a Short Position requires Buying (Long direction order).
                     - The labels above align with the USER INTENT:
                       - User clicks "Close Long" -> Code calls handleOrder('sell')
                       - User clicks "Close Short" -> Code calls handleOrder('buy')
                    */}
                </div>

                {/* Summary Grid */}
                <div className="space-y-2 text-[11px] font-medium mb-4">
                    {/* Est. Liq. Price */}
                    <div className="flex justify-between items-center">
                        <span className="text-white">Est. Liq. Price</span>
                        <div className="flex items-center gap-1.5 font-mono">
                            <span className="text-[#0ECB81] border-b border-dashed border-[#0ECB81]/40 cursor-help hover:border-solid">${summary.liqLong > 0 ? summary.liqLong.toFixed(2) : '0.00'}</span>
                            <span className="text-[#848E9C]">/</span>
                            <span className="text-[#F6465D] border-b border-dashed border-[#F6465D]/40 cursor-help hover:border-solid">${summary.liqShort > 0 ? summary.liqShort.toFixed(2) : '0.00'}</span>
                        </div>
                    </div>

                    {/* Value */}
                    <div className="flex justify-between items-center">
                        <span className="text-white">Value</span>
                        <div className="flex items-center gap-1.5 font-mono">
                            <span className="text-[#0ECB81] border-b border-dashed border-[#0ECB81]/40 cursor-help hover:border-solid">${summary.usdt.toFixed(2)}</span>
                            <span className="text-[#848E9C]">/</span>
                            <span className="text-[#F6465D] border-b border-dashed border-[#F6465D]/40 cursor-help hover:border-solid">${summary.usdt.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Margin */}
                    <div className="flex justify-between items-center">
                        <span className="text-white">Margin</span>
                        <div className="flex items-center gap-1.5 font-mono">
                            <span className="text-[#0ECB81] border-b border-dashed border-[#0ECB81]/40 cursor-help hover:border-solid">${summary.margin.toFixed(2)}</span>
                            <span className="text-[#848E9C]">/</span>
                            <span className="text-[#F6465D] border-b border-dashed border-[#F6465D]/40 cursor-help hover:border-solid">${summary.margin.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Slippage */}
                    <div className="flex justify-between items-center">
                        <span className="text-white">Slippage</span>
                        <div className="flex items-center gap-1.5 font-mono">
                            <span className="text-[#0ECB81] border-b border-dashed border-[#0ECB81]/40 cursor-help hover:border-solid">0.05 %</span>
                            <span className="text-[#848E9C]">/</span>
                            <span className="text-[#F6465D] border-b border-dashed border-[#F6465D]/40 cursor-help hover:border-solid">0.05 %</span>
                        </div>
                    </div>

                    {/* Estimated fees */}
                    <div className="flex justify-between items-center pt-0.5">
                        <span className="text-white">Estimated fees</span>
                        <span className="text-white font-bold">0.05% / Zero</span>
                    </div>
                </div>

                {/* Account Overview */}
                <div className="space-y-2 text-[11px]">
                    <h3 className="text-white font-bold text-xs mb-2">Account Overview</h3>
                    <div className="flex justify-between">
                        <span className="text-[#848E9C] border-b border-dashed border-[#848E9C]/50 cursor-pointer hover:text-white">Account Equity</span>
                        <span className="text-white font-mono font-bold">$ 0.00 USDT</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#848E9C] border-b border-dashed border-[#848E9C]/50 cursor-pointer hover:text-white">Balance</span>
                        <span className="text-white font-mono font-bold">$ 0.00 USDT</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#848E9C] border-b border-dashed border-[#848E9C]/50 cursor-pointer hover:text-white">Balance available to trade</span>
                        <span className="text-white font-mono font-bold">$ 0.00 USDT</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#848E9C] border-b border-dashed border-[#848E9C]/50 cursor-pointer hover:text-white">Unrealised PnL</span>
                        <span className="text-[#0ECB81] font-mono font-bold">$ 0.00 USDT</span>
                    </div>
                </div>
            </div>

            <FundsTransferModal
                isOpen={isTransferModalOpen}
                initialTab={transferTab}
                onClose={() => setIsTransferModalOpen(false)}
            />
        </div>
    );
}
