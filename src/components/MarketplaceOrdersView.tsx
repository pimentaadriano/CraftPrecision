import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Play,
  Search,
} from 'lucide-react';
import { MarketplaceChannel, MarketplaceOrder } from '../types/operations';
import { ChannelBadge, LotTag } from './ChannelBadge';

interface MarketplaceOrdersViewProps {
  orders: MarketplaceOrder[];
  onOpenPackSlip: (order: MarketplaceOrder) => void;
  onDispatchOrderToCut: (order: MarketplaceOrder) => void;
}

const CHANNEL_TABS: Array<'Todos' | Exclude<MarketplaceChannel, 'B2B Sob Medida'>> = [
  'Todos',
  'Mercado Livre',
  'Shopee',
  'Amazon',
  'Elo7',
];

export const MarketplaceOrdersView: React.FC<MarketplaceOrdersViewProps> = ({
  orders,
  onOpenPackSlip,
  onDispatchOrderToCut,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<
    'Todos' | Exclude<MarketplaceChannel, 'B2B Sob Medida'>
  >('Todos');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (selectedChannel !== 'Todos' && o.channel !== selectedChannel) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.productTitle.toLowerCase().includes(q) ||
          o.species.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, selectedChannel, search]);

  const totalRevenueBrl = useMemo(
    () => filteredOrders.reduce((acc, o) => acc + o.totalValueBrl, 0),
    [filteredOrders]
  );

  return (
    <div className="space-y-5">
      {/* Top Filter & Summary Bar */}
      <section className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-[#171C23] dark:text-[#EDF1FB]">
              Fila Unificada de Pedidos Omnichannel
            </h2>
            <p className="text-xs text-[#575F6C] dark:text-[#9AA4B2] mt-0.5 tabular-nums">
              {filteredOrders.length} pedidos listados · Valor total em carteira:{' '}
              <span className="font-mono font-semibold text-[#171C23] dark:text-[#EDF1FB]">
                {totalRevenueBrl.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#575F6C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar MLB-, SHP-, cliente ou item..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-xs text-[#171C23] dark:text-[#EDF1FB] placeholder:text-[#837469] focus:outline-none focus:border-[#8B5A2B]"
            />
          </div>
        </div>

        {/* Channel Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#EAEFF8] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] rounded-lg overflow-x-auto">
          {CHANNEL_TABS.map((ch) => {
            const count =
              ch === 'Todos'
                ? orders.length
                : orders.filter((o) => o.channel === ch).length;
            const active = selectedChannel === ch;
            return (
              <button
                key={ch}
                type="button"
                onClick={() => setSelectedChannel(ch)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-[#2C3440] text-[#171C23] dark:text-white border border-[#DEE2EC] dark:border-[#3F4754]'
                    : 'text-[#575F6C] dark:text-[#9AA4B2] hover:text-[#171C23] dark:hover:text-white'
                }`}
              >
                {ch}{' '}
                <span className="font-mono text-[11px] opacity-75 tabular-nums">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Orders Table */}
      <section className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#2C3440] dark:bg-[#12161B] text-[#EDF1FB] text-[11px] font-medium">
                <th className="py-2.5 px-4 whitespace-nowrap">Canal &amp; Pedido</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Produto &amp; Acabamento</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Cliente / Destino</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Qtd</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Valor</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Prazo SLA</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Lote Vinculado</th>
                <th className="py-2.5 px-4 whitespace-nowrap text-right">Expedição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2A323D] text-[13px]">
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order.orderId}
                  className={`transition-colors hover:bg-[#FFF6EE]/60 dark:hover:bg-[#262C35] ${
                    idx % 2 === 0
                      ? 'bg-white dark:bg-[#1E232A]'
                      : 'bg-[#F8F9FA] dark:bg-[#191D23]'
                  }`}
                >
                  <td className="py-3 px-4 whitespace-nowrap align-top">
                    <ChannelBadge channel={order.channel} orderCode={order.orderId} />
                  </td>
                  <td className="py-3 px-3 align-top max-w-xs">
                    <div className="font-medium text-[#171C23] dark:text-[#EDF1FB] leading-snug">
                      {order.productTitle}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
                      {order.species} ·{' '}
                      <span className="font-mono">
                        {order.dimensionsMm.t}×{order.dimensionsMm.w}×{order.dimensionsMm.l} mm
                      </span>{' '}
                      · {order.finishSpec}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap align-top">
                    <div className="text-xs font-medium text-[#171C23] dark:text-[#EDF1FB]">
                      {order.customerName}
                    </div>
                    <div className="text-[11px] text-[#575F6C] dark:text-[#9AA4B2]">
                      {order.cityState}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-right font-mono text-xs font-semibold text-[#171C23] dark:text-[#EDF1FB] tabular-nums align-top">
                    {order.qty}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-right font-mono text-xs font-medium text-[#171C23] dark:text-[#EDF1FB] tabular-nums align-top">
                    {order.totalValueBrl.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-xs text-[#575F6C] dark:text-[#BFC7D6] tabular-nums align-top">
                    {order.slaDeadline}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap align-top">
                    {order.linkedBatchId ? (
                      <LotTag lotId={order.linkedBatchId} />
                    ) : (
                      <span className="text-xs font-medium text-[#D97706] dark:text-[#FBBF24]">
                        Aguardando Corte
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right align-top">
                    <div className="inline-flex items-center gap-2">
                      {!order.linkedBatchId && (
                        <button
                          type="button"
                          onClick={() => onDispatchOrderToCut(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#8B5A2B] hover:bg-[#704822] text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          <span>Enviar p/ Corte</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenPackSlip(order)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                          order.packSlipGenerated
                            ? 'border-[#2E7D32]/45 bg-[#E8F5E9]/70 dark:bg-[#122D16] text-[#005B14] dark:text-[#88D982]'
                            : 'border-[#2C3440] dark:border-[#575F6C] text-[#2C3440] dark:text-[#EDF1FB] hover:bg-[#F0F4FD] dark:hover:bg-[#2C3440]'
                        }`}
                      >
                        {order.packSlipGenerated ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Ver Romaneio</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3" />
                            <span>Gerar Romaneio</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
