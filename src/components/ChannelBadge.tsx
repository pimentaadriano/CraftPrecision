import React from 'react';
import { MarketplaceChannel } from '../types/operations';

interface ChannelBadgeProps {
  channel: MarketplaceChannel;
  orderCode?: string;
}

const CHANNEL_STYLE: Record<
  MarketplaceChannel,
  { bg: string; border: string; text: string; short: string; marker: string }
> = {
  'Mercado Livre': {
    bg: 'bg-[#FFF8DB] dark:bg-[#2F2811]',
    border: 'border-[#EAB308]/60 dark:border-[#EAB308]/40',
    text: 'text-[#1D4E89] dark:text-[#FDE047]',
    short: 'ML',
    marker: 'bg-[#EAB308]',
  },
  Shopee: {
    bg: 'bg-[#FFF0EB] dark:bg-[#331B14]',
    border: 'border-[#EA580C]/50 dark:border-[#EA580C]/40',
    text: 'text-[#C2410C] dark:text-[#FB923C]',
    short: 'SHP',
    marker: 'bg-[#EA580C]',
  },
  Amazon: {
    bg: 'bg-[#EEF0F4] dark:bg-[#232830]',
    border: 'border-[#2C3440]/40 dark:border-[#575F6C]',
    text: 'text-[#171C23] dark:text-[#EDF1FB]',
    short: 'AMZ',
    marker: 'bg-[#8B5A2B]',
  },
  Elo7: {
    bg: 'bg-[#E6F7F5] dark:bg-[#102C2A]',
    border: 'border-[#0D9488]/45 dark:border-[#0D9488]/40',
    text: 'text-[#0F766E] dark:text-[#5EEAD4]',
    short: 'EL7',
    marker: 'bg-[#0D9488]',
  },
  'B2B Sob Medida': {
    bg: 'bg-[#FFF6EE] dark:bg-[#2E1E10]',
    border: 'border-[#8B5A2B]/45 dark:border-[#8B5A2B]/50',
    text: 'text-[#6F4315] dark:text-[#F9BA82]',
    short: 'B2B',
    marker: 'bg-[#8B5A2B]',
  },
};

export const ChannelBadge: React.FC<ChannelBadgeProps> = ({
  channel,
  orderCode,
}) => {
  const style = CHANNEL_STYLE[channel];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium whitespace-nowrap shrink-0 ${style.bg} ${style.border} ${style.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-xs shrink-0 ${style.marker}`}
        aria-hidden="true"
      />
      <span>{channel}</span>
      {orderCode && (
        <span className="font-mono text-[10px] opacity-85 border-l border-current/25 pl-1.5">
          {orderCode}
        </span>
      )}
    </span>
  );
};

interface LotTagProps {
  lotId: string;
}

export const LotTag: React.FC<LotTagProps> = ({ lotId }) => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#EAEFF8] dark:bg-[#2C3440] border border-[#DEE2EC] dark:border-[#3F4754] font-mono text-[11px] font-medium text-[#171C23] dark:text-[#EDF1FB] whitespace-nowrap shrink-0">
    {lotId}
  </span>
);
