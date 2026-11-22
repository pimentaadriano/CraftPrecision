import React from 'react';
import { ChevronRight, Menu, Plus } from 'lucide-react';
import { ScreenKey } from '../types/operations';

interface TopBarProps {
  activeScreen: ScreenKey;
  onOpenMobileMenu: () => void;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
}

const SCREEN_BREADCRUMBS: Record<ScreenKey, string> = {
  overview: 'Pipeline de Produção',
  inventory: 'Chapas & Plano de Corte',
  stations: 'Estações CNC & Artesãos',
  marketplace: 'Pedidos Marketplaces',
  quality: 'Qualidade & Refugo',
};

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onOpenMobileMenu,
  onPrimaryAction,
  primaryActionLabel,
}) => {
  return (
    <header className="h-16 bg-white dark:bg-[#1E232A] border-b border-[#E5E7EB] dark:border-[#2A323D] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile Menu Trigger + Breadcrumb Trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-1 rounded border border-[#E5E7EB] dark:border-[#2A323D] text-[#2C3440] dark:text-[#EDF1FB] hover:bg-[#F0F4FD] dark:hover:bg-[#2C3440]"
          aria-label="Abrir navegação"
        >
          <Menu className="w-4 h-4" />
        </button>

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm min-w-0"
        >
          <span className="text-[#575F6C] dark:text-[#9AA4B2] font-medium whitespace-nowrap hidden sm:inline">
            Craft Precision
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[#9AA4B2] shrink-0 hidden sm:inline" />
          <span className="font-display font-semibold text-[#171C23] dark:text-[#EDF1FB] truncate">
            {SCREEN_BREADCRUMBS[activeScreen]}
          </span>
        </nav>
      </div>

      {/* Right: Single Primary Action CTA */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onPrimaryAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#8B5A2B] hover:bg-[#704822] active:bg-[#5A3611] text-white text-[13px] font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5A2B] focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>{primaryActionLabel}</span>
        </button>
      </div>
    </header>
  );
};
