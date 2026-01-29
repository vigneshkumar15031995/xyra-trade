import React from 'react';
import {
    CandlestickChart,
    ArrowLeftRight,
    Trophy,
    Users,
    Gift,
    BookOpen,
    FileText,
    Star,
    Info,
    CreditCard,
    Download,
    UserCircle,
    Bell,
    Settings
} from 'lucide-react';
import { useState } from 'react';
import FundsTransferModal from '../exchange/FundsTransferModal';

export default function Header() {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const navItems = [
        { label: 'Perps', icon: CandlestickChart, active: true },
        { label: 'Swap', icon: ArrowLeftRight, active: false },
        { label: 'Leaderboard', icon: Trophy, active: false },
        { label: 'Refer', icon: Users, active: false },
        { label: 'Rewards', icon: Gift, active: false },
        { label: 'Learn', icon: BookOpen, active: false },
        { label: 'Docs', icon: FileText, active: false },
    ];

    return (
        <header className="h-16 bg-black border-b border-[#1E2026] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span className="text-2xl font-bold text-[#3dd2e5] tracking-tight">Xyra</span>
                    <span className="text-2xl font-bold text-[#5f7488] tracking-tight">Labs</span>
                </div>

                {/* Nav */}
                <nav className="hidden xl:flex items-center gap-6">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href="#"
                            className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${item.active ? 'text-[#3dd2e5]' : 'text-[#848e9c] hover:text-gray-200'
                                }`}
                        >
                            <item.icon className="w-4 h-4" strokeWidth={2.5} />
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* VIP Button */}
                <button className="flex items-center gap-2 bg-[#1E2329] hover:bg-[#2A2E35] text-[#848E9C] px-3 py-2 rounded-lg text-xs font-bold transition-colors">
                    <Star className="w-3.5 h-3.5" />
                    <span>VIP</span>
                    <Info className="w-3.5 h-3.5 text-[#EAECEF]" />
                </button>

                {/* Buy USDT */}
                <button className="flex items-center gap-2 bg-[#1E2329] hover:bg-[#2A2E35] text-[#3dd2e5] px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                    <CreditCard className="w-4 h-4" />
                    <span>Buy USDT on Aptos</span>
                </button>

                {/* Deposit */}
                <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="flex items-center gap-2 bg-[#1E2329] hover:bg-[#2A2E35] text-[#3dd2e5] px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                >
                    <Download className="w-4 h-4" />
                    <span>Deposit</span>
                </button>

                {/* Sign In */}
                <button className="flex items-center gap-2 bg-[#1E2329] hover:bg-[#2A2E35] text-[#3dd2e5] px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                    <UserCircle className="w-4 h-4" />
                    <span>Sign in</span>
                </button>

                {/* Icons */}
                <button className="bg-[#1E2329] hover:bg-[#2A2E35] text-[#848E9C] hover:text-[#EAECEF] p-2 rounded-lg transition-colors">
                    <Bell className="w-4 h-4" />
                </button>
                <button className="bg-[#1E2329] hover:bg-[#2A2E35] text-[#848E9C] hover:text-[#EAECEF] p-2 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                </button>
            </div>
            {/* Modal */}
            <FundsTransferModal
                isOpen={isTransferModalOpen}
                initialTab="deposit"
                onClose={() => setIsTransferModalOpen(false)}
            />
        </header>
    );
}
