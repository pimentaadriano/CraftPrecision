import React from 'react';
import {
  Activity,
  Cpu,
  Layers,
  Moon,
  PackageCheck,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { ScreenKey } from '../types/operations';

interface SidebarProps {
  activeScreen: ScreenKey;
  onSelectScreen: (screen: ScreenKey) => void;
  isDark: boolean;
  onToggleDark: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  counts: {
    activeBatches: number;
    lowStockLots: number;
    pendingOrders: number;
    qcQueue: number;
  };
}

const NAV_ITEMS: Array<{
  key: ScreenKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  countKey?: keyof SidebarProps['counts'];
}> = [
  {
    key: 'overview',
    label: 'Pipeline de Produção',
    icon: Activity,
    countKey: 'activeBatches',
  },
  {
    key: 'inventory',
    label: 'Chapas & Plano de Corte',
    icon: Layers,
    countKey: 'lowStockLots',
  },
  {
    key: 'stations',
    label: 'Estações CNC & Artesãos',
    icon: Cpu,
  },
  {
    key: 'marketplace',
    label: 'Pedidos Marketplaces',
    icon: PackageCheck,
    countKey: 'pendingOrders',
  },
  {
    key: 'quality',
    label: 'Qualidade & Refugo',
    icon: ShieldCheck,
    countKey: 'qcQueue',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onSelectScreen,
  isDark,
  onToggleDark,
  mobileOpen,
  onCloseMobile,
  counts,
}) => {
  const handleNav = (key: ScreenKey) => {
    onSelectScreen(key);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#2C3440] dark:bg-[#12161B] text-[#EDF1FB] border-r border-[#1E232A] dark:border-[#2A323D] select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Geometric Joinery / Dovetail Emblem */}
          <div className="w-8 h-8 rounded bg-[#8B5A2B] flex items-center justify-center shrink-0 border border-[#F9BA82]/30">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 17h16M7 7l2 10M17 7l-2 10" />
            </svg>
          </div>
          <div className="min-w-0">
            <span className="block font-display text-[15px] font-bold tracking-tight text-white whitespace-nowrap truncate">
              Craft Precision
            </span>
            <span className="block font-mono text-[10px] text-[#BFC7D6] whitespace-nowrap truncate">
              MARCENARIA &amp; CNC
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded text-[#BFC7D6] hover:text-white hover:bg-white/10"
          aria-label="Fechar menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Navegação Principal">
        <div className="px-3 pb-2 text-[11px] font-medium text-[#9AA4B2]">
          Operações da Fábrica
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.key;
          const countVal = item.countKey ? counts[item.countKey] : undefined;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNav(item.key)}
              className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded text-left text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F9BA82] ${
                isActive
                  ? 'bg-[#8B5A2B] text-white'
                  : 'text-[#D6DAE4] hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-[#9AA4B2]'
                  }`}
                />
                <span className="whitespace-nowrap truncate">{item.label}</span>
              </span>
              {typeof countVal === 'number' && countVal > 0 && (
                <span
                  className={`font-mono text-[11px] tabular-nums px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-[#6F4315] text-[#FFDCC1]'
                      : 'bg-[#1E232A] text-[#BFC7D6]'
                  }`}
                >
                  {countVal}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer: Shop-floor Display Mode & Shift Info */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-[#BFC7D6]">Modo Chão de Fábrica</span>
          <button
            type="button"
            onClick={onToggleDark}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/15 bg-[#1E232A] text-xs font-medium text-[#EDF1FB] hover:border-[#8B5A2B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F9BA82]" />
                <span>Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#BFC7D6]" />
                <span>Escuro</span>
              </>
            )}
          </button>
        </div>
        <div className="pt-2 border-t border-white/10 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#1E232A] border border-white/15 flex items-center justify-center font-mono text-[11px] font-semibold text-[#F9BA82] shrink-0">
            HV
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">
              Henrique Vasconcelos
            </p>
            <p className="text-[11px] text-[#9AA4B2] truncate">
              Turno A · Unidade Curitiba
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile / Tablet Slide-over Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#14181D]/65"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-64 max-w-[80vw] h-full">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
