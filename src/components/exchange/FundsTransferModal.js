import React, { useState } from 'react';
import { X, ArrowLeft, Wallet } from 'lucide-react';

export default function FundsTransferModal({ isOpen, onClose, initialTab = 'deposit' }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [amount, setAmount] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    // Reset tab when opening if needed, but for now we rely on initialTab prop updates or internal state
    // Ideally the parent should control the tab or key the component to reset it.
    // For simplicity, we'll use side-effect to sync internal state if prop changes while open? 
    // Actually, distinct buttons open it, so we can just set state on mount or when receiving new props if we wanted,
    // but a simple layout is fine. We will let the parent pass the initial tab.

    // Derived state for dynamic text
    const isDeposit = activeTab === 'deposit';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[480px] bg-[#0E0E0E] border border-[#1E2026] rounded-xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2026]">
                    <h2 className="text-white text-base font-bold">Funds transfer</h2>
                    <button onClick={onClose} className="text-[#848E9C] hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Info Box */}
                <div className="px-6 py-4 bg-[#0B0E11] border-b border-[#1E2026]">
                    <p className="text-[11px] text-[#848E9C] leading-snug">
                        Just getting started? Deposit a small amount to safely experience how perpetual trading works.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#1E2026]">
                    <button
                        onClick={() => setActiveTab('deposit')}
                        className={`flex-1 py-3 text-sm font-bold relative transition-colors ${activeTab === 'deposit' ? 'text-white' : 'text-[#848E9C] hover:text-[#EAECEF]'
                            }`}
                    >
                        Deposit
                        {activeTab === 'deposit' && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3dd2e5]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('withdraw')}
                        className={`flex-1 py-3 text-sm font-bold relative transition-colors ${activeTab === 'withdraw' ? 'text-white' : 'text-[#848E9C] hover:text-[#EAECEF]'
                            }`}
                    >
                        Withdraw
                        {activeTab === 'withdraw' && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3dd2e5]" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">

                    {/* Back Link */}
                    <div className="flex items-center gap-2 text-[#3dd2e5] cursor-pointer hover:underline mb-2">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">Wallet & Profiles</span>
                    </div>

                    {/* From/To Account */}
                    <div>
                        <label className="block text-[11px] text-[#848E9C] mb-2">
                            {isDeposit ? 'Deposit to' : 'Withdraw to'}
                        </label>
                        <div className="h-12 bg-[#0B0E11] border border-[#2B3139] rounded-lg flex items-center justify-between px-4">
                            <span className="text-sm font-bold text-white">Trading Account</span>
                            <span className="text-xs text-[#848E9C]">0.00 USDT</span>
                        </div>
                    </div>

                    {/* Chain & Token */}
                    <div>
                        <label className="block text-[11px] text-[#848E9C] mb-2">
                            Chain & Token
                        </label>
                        <div className="h-12 bg-[#0B0E11] border border-[#2B3139] rounded-lg flex items-center gap-3 px-4">
                            <div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center text-white text-[10px] font-bold">T</div>
                            <span className="text-sm font-bold text-white">USDT (Aptos)</span>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-[11px] text-[#848E9C] mb-2">
                            {isDeposit ? 'Deposit (USDT)' : 'Withdraw (USDT)'}
                        </label>
                        <div className="h-12 bg-[#0B0E11] border border-[#2B3139] rounded-lg flex items-center justify-between px-4 focus-within:border-[#3dd2e5] transition-colors">
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent text-white font-mono text-base focus:outline-none w-full placeholder-[#474D57]"
                            />
                            <div className="flex items-center gap-2">
                                {['25%', '50%', '75%', 'Max'].map((pct) => (
                                    <button
                                        key={pct}
                                        className="text-[10px] font-bold text-[#3dd2e5] hover:text-white transition-colors"
                                    >
                                        {pct}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="mt-2 text-[10px] text-[#848E9C]">
                            from Wallet ( 0.00 USDT )
                        </p>
                    </div>

                    {/* Action Button */}
                    <button className="w-full h-12 bg-[#0B0E11] border border-[#3dd2e5] rounded-xl text-white font-bold text-sm hover:bg-[#3dd2e5] hover:text-black transition-all shadow-[0_0_10px_rgba(61,210,229,0.1)] hover:shadow-[0_0_20px_rgba(61,210,229,0.3)] mt-2">
                        {isDeposit ? 'Deposit' : 'Withdraw'}
                    </button>

                </div>
            </div>
        </div>
    );
}

// Ensure you import lucide-react icons if not already available in the project environment, 
// though the prompt says I can use lucide-react.
