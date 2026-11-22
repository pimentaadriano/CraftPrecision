import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Columns3,
  Layers,
  List,
  RefreshCw,
  Scissors,
  Search,
} from 'lucide-react';
import {
  Artisan,
  MarketplaceChannel,
  MarketplaceOrder,
  PRODUCTION_STAGES,
  ProductionBatch,
  WorkStation,
} from '../types/operations';
import { ChannelBadge, LotTag } from './ChannelBadge';
import { StageTimeline } from './StageTimeline';

interface ProductionOverviewProps {
  batches: ProductionBatch[];
  stations: WorkStation[];
  artisans: Artisan[];
  orders: MarketplaceOrder[];
  sheetYieldPct: number;
  qcPassRatePct: number;
  onAdvanceStage: (batchId: string) => void;
  onSetStage: (batchId: string, stageIndex: number) => void;
  onOpenCuttingPlan: (species: ProductionBatch['species'], batchId: string) => void;
  onOpenScrapModal: (batch: ProductionBatch) => void;
}

type ViewMode = 'list' | 'kanban';

export const ProductionOverview: React.FC<ProductionOverviewProps> = ({
  batches,
  stations,
  artisans,
  orders,
  sheetYieldPct,
  qcPassRatePct,
  onAdvanceStage,
  onSetStage,
  onOpenCuttingPlan,
  onOpenScrapModal,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [stageFilter, setStageFilter] = useState<number | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<MarketplaceChannel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncingChannel, setSyncingChannel] = useState<string | null>(null);
  const [lastSyncNote, setLastSyncNote] = useState<string>('Sincronizado há 2 min');

  const stationMap = useMemo(
    () => Object.fromEntries(stations.map((s) => [s.id, s])),
    [stations]
  );
  const artisanMap = useMemo(
    () => Object.fromEntries(artisans.map((a) => [a.id, a])),
    [artisans]
  );

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (stageFilter !== 'all' && b.currentStageIndex !== stageFilter) return false;
      if (channelFilter !== 'all' && b.channel !== channelFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.id.toLowerCase().includes(q) ||
          b.itemName.toLowerCase().includes(q) ||
          b.orderCode.toLowerCase().includes(q) ||
          b.species.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [batches, stageFilter, channelFilter, searchQuery]);

  const activeCount = batches.filter((b) => b.currentStageIndex < 5).length;
  const totalUnits = batches.reduce((acc, b) => acc + b.quantity, 0);
  const dispatchReadyCount = batches.filter((b) => b.currentStageIndex === 5).length;

  const channelStats = useMemo(() => {
    const channels: Array<{
      name: Exclude<MarketplaceChannel, 'B2B Sob Medida'>;
      accent: string;
    }> = [
      { name: 'Mercado Livre', accent: 'bg-[#EAB308]' },
      { name: 'Shopee', accent: 'bg-[#EA580C]' },
      { name: 'Amazon', accent: 'bg-[#2C3440] dark:bg-[#8B5A2B]' },
      { name: 'Elo7', accent: 'bg-[#0D9488]' },
    ];
    return channels.map((ch) => {
      const chOrders = orders.filter((o) => o.channel === ch.name);
      const pendingSlips = chOrders.filter((o) => !o.packSlipGenerated).length;
      return {
        ...ch,
        totalOrders: chOrders.length,
        pendingSlips,
      };
    });
  }, [orders]);

  const handleSyncChannel = (channelName: string) => {
    setSyncingChannel(channelName);
    setTimeout(() => {
      setSyncingChannel(null);
      setLastSyncNote(`${channelName} atualizado agora`);
    }, 550);
  };

  return (
    <div className="space-y-6">
      {/* 4-Column KPI Strip */}
      <section aria-label="Indicadores de Produção" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg p-5">
          <div className="text-xs font-medium text-[#575F6C] dark:text-[#9AA4B2]">
            Lotes Ativos em Fábrica
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-display text-3xl font-bold text-[#171C23] dark:text-[#EDF1FB] tabular-nums">
              {activeCount}
            </span>
            <span className="font-mono text-xs text-[#6F4315] dark:text-[#F9BA82] tabular-nums">
              {totalUnits} peças no fluxo
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg p-5">
          <div className="text-xs font-medium text-[#575F6C] dark:text-[#9AA4B2]">
            Aproveitamento de Chapas
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-display text-3xl font-bold text-[#171C23] dark:text-[#EDF1FB] tabular-nums">
              {sheetYieldPct.toFixed(1)}%
            </span>
            <span className="font-mono text-xs text-[#2E7D32] dark:text-[#88D982] tabular-nums">
              Kerf serra 3.2 mm
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg p-5">
          <div className="text-xs font-medium text-[#575F6C] dark:text-[#9AA4B2]">
            Aprovação Direta (QC)
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-display text-3xl font-bold text-[#171C23] dark:text-[#EDF1FB] tabular-nums">
              {qcPassRatePct.toFixed(1)}%
            </span>
            <span className="font-mono text-xs text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
              Tolerância ±0.20 mm
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg p-5">
          <div className="text-xs font-medium text-[#575F6C] dark:text-[#9AA4B2]">
            Prontos para Expedição
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="font-display text-3xl font-bold text-[#171C23] dark:text-[#EDF1FB] tabular-nums">
              {dispatchReadyCount}
            </span>
            <span className="font-mono text-xs text-[#1D4E89] dark:text-[#93C5FD] tabular-nums">
              Coleta 14:00 · 4 canais
            </span>
          </div>
        </div>
      </section>

      {/* Marketplace Channels Sync Strip */}
      <section
        aria-label="Canais de Marketplace"
        className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg"
      >
        <div className="px-5 py-3 border-b border-[#E5E7EB] dark:border-[#2A323D] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-sm font-semibold text-[#171C23] dark:text-[#EDF1FB]">
              Sincronização de Canais
            </h2>
            <span className="text-xs text-[#575F6C] dark:text-[#9AA4B2] font-mono">
              {lastSyncNote}
            </span>
          </div>
          {channelFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setChannelFilter('all')}
              className="text-xs font-medium text-[#8B5A2B] dark:text-[#F9BA82] hover:underline cursor-pointer"
            >
              Limpar filtro de canal ({channelFilter})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB] dark:divide-[#2A323D]">
          {channelStats.map((ch) => {
            const isSelected = channelFilter === ch.name;
            const isSyncing = syncingChannel === ch.name;
            return (
              <div
                key={ch.name}
                className={`px-5 py-3.5 flex items-center justify-between gap-3 transition-colors ${
                  isSelected
                    ? 'bg-[#FFF6EE] dark:bg-[#2E1E10]'
                    : 'hover:bg-[#F8F9FA] dark:hover:bg-[#242A32]'
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setChannelFilter(isSelected ? 'all' : ch.name)
                  }
                  className="text-left min-w-0 flex-1 cursor-pointer focus-visible:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-xs shrink-0 ${ch.accent}`}
                      aria-hidden="true"
                    />
                    <span className="text-[13px] font-semibold text-[#171C23] dark:text-[#EDF1FB] truncate">
                      {ch.name}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
                    <span className="font-mono">{ch.totalOrders} pedidos</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        ch.pendingSlips > 0
                          ? 'text-[#D97706] dark:text-[#FBBF24] font-medium'
                          : 'text-[#2E7D32] dark:text-[#88D982]'
                      }
                    >
                      {ch.pendingSlips > 0
                        ? `${ch.pendingSlips} romaneios pend.`
                        : 'Etiquetas ok'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSyncChannel(ch.name)}
                  title={`Sincronizar ${ch.name}`}
                  aria-label={`Sincronizar ${ch.name}`}
                  className="p-2 rounded border border-[#E5E7EB] dark:border-[#3F4754] text-[#575F6C] dark:text-[#BFC7D6] hover:text-[#171C23] dark:hover:text-white hover:border-[#8B5A2B] transition-colors cursor-pointer shrink-0"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#8B5A2B]' : ''}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workspace Filter & View Toolbar */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Stage Filter Segmented Bar */}
        <div className="flex items-center gap-1 p-1 bg-[#EAEFF8] dark:bg-[#1E232A] border border-[#DEE2EC] dark:border-[#2A323D] rounded-lg overflow-x-auto">
          <button
            type="button"
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              stageFilter === 'all'
                ? 'bg-white dark:bg-[#2C3440] text-[#171C23] dark:text-white border border-[#DEE2EC] dark:border-[#3F4754]'
                : 'text-[#575F6C] dark:text-[#9AA4B2] hover:text-[#171C23] dark:hover:text-white'
            }`}
          >
            Todas ({batches.length})
          </button>
          {PRODUCTION_STAGES.map((stage, idx) => {
            const count = batches.filter((b) => b.currentStageIndex === idx).length;
            const active = stageFilter === idx;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setStageFilter(idx)}
                className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-[#2C3440] text-[#6F4315] dark:text-[#F9BA82] border border-[#DEE2EC] dark:border-[#3F4754]'
                    : 'text-[#575F6C] dark:text-[#9AA4B2] hover:text-[#171C23] dark:hover:text-white'
                }`}
              >
                {stage}{' '}
                <span className="font-mono text-[11px] opacity-75 tabular-nums">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + List/Kanban Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#575F6C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar lote, espécie ou pedido..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-white dark:bg-[#1E232A] border border-[#DEE2EC] dark:border-[#2A323D] text-[13px] text-[#171C23] dark:text-[#EDF1FB] placeholder:text-[#837469] focus:outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="flex items-center p-0.5 bg-[#EAEFF8] dark:bg-[#1E232A] border border-[#DEE2EC] dark:border-[#2A323D] rounded shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#2C3440] text-[#171C23] dark:text-white'
                  : 'text-[#575F6C] dark:text-[#9AA4B2]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Detalhada</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-[#2C3440] text-[#171C23] dark:text-white'
                  : 'text-[#575F6C] dark:text-[#9AA4B2]'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Pipeline Content */}
      {filteredBatches.length === 0 ? (
        <div className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg p-12 text-center">
          <Layers className="w-8 h-8 text-[#837469] mx-auto mb-3" />
          <h3 className="font-display text-base font-semibold text-[#171C23] dark:text-[#EDF1FB]">
            Nenhum lote encontrado neste filtro
          </h3>
          <p className="mt-1 text-sm text-[#575F6C] dark:text-[#9AA4B2]">
            Ajuste o estágio selecionado, canal de venda ou termo de busca.
          </p>
          <button
            type="button"
            onClick={() => {
              setStageFilter('all');
              setChannelFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded border border-[#2C3440] dark:border-[#575F6C] text-xs font-semibold text-[#2C3440] dark:text-[#EDF1FB] hover:bg-[#F0F4FD] dark:hover:bg-[#2C3440] cursor-pointer"
          >
            Redefinir Filtros
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredBatches.map((batch) => {
            const station = stationMap[batch.assignedStationId];
            const artisan = artisanMap[batch.assignedArtisanId];
            const isFinalStage = batch.currentStageIndex === PRODUCTION_STAGES.length - 1;
            const currentStageName = PRODUCTION_STAGES[batch.currentStageIndex];

            return (
              <article
                key={batch.id}
                className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg transition-colors"
              >
                {/* Header Row */}
                <div className="px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E5E7EB] dark:border-[#2A323D]">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <LotTag lotId={batch.id} />
                      <ChannelBadge channel={batch.channel} orderCode={batch.orderCode} />
                      {batch.priority === 'Urgente' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3C7] dark:bg-[#3A280A] border border-[#D97706]/40 text-[11px] font-medium text-[#B45309] dark:text-[#FBBF24]">
                          <AlertTriangle className="w-3 h-3" />
                          Prioridade Urgente
                        </span>
                      )}
                      {batch.qcStatus === 'Aprovado' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E8F5E9] dark:bg-[#122D16] border border-[#2E7D32]/40 text-[11px] font-medium text-[#005B14] dark:text-[#88D982]">
                          <CheckCircle2 className="w-3 h-3" />
                          QC Liberado
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-base font-semibold text-[#171C23] dark:text-[#EDF1FB]">
                      {batch.itemName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
                      <span className="font-medium text-[#171C23] dark:text-[#D6DAE4]">
                        {batch.species}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">
                        {batch.dimensionsMm.t} × {batch.dimensionsMm.w} × {batch.dimensionsMm.l} mm
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{batch.quantity} unid.</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{batch.moisturePct.toFixed(1)}% MC</span>
                      <span aria-hidden="true">·</span>
                      <span>{batch.finishSpec}</span>
                    </div>
                  </div>

                  {/* Operational Buttons */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenCuttingPlan(batch.species, batch.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#2C3440] dark:border-[#575F6C] text-xs font-medium text-[#2C3440] dark:text-[#EDF1FB] hover:bg-[#F0F4FD] dark:hover:bg-[#2C3440] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Plano de Corte</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenScrapModal(batch)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#DC2626]/45 text-xs font-medium text-[#BA1A1A] dark:text-[#FCA5A5] hover:bg-[#FFDAD6]/50 dark:hover:bg-[#3A1616] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Refugo</span>
                    </button>

                    {!isFinalStage ? (
                      <button
                        type="button"
                        onClick={() => onAdvanceStage(batch.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#8B5A2B] hover:bg-[#704822] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>Concluir {currentStageName}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E8F5E9] dark:bg-[#122D16] border border-[#2E7D32]/40 text-xs font-semibold text-[#005B14] dark:text-[#88D982] whitespace-nowrap shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Em Expedição
                      </span>
                    )}
                  </div>
                </div>

                {/* 6-Stage Timeline + Station Assignment */}
                <div className="px-5 py-4 grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
                  <div className="xl:col-span-8">
                    <StageTimeline
                      currentStageIndex={batch.currentStageIndex}
                      stageTimesMin={batch.stageTimesMin}
                      onSelectStage={(idx) => onSetStage(batch.id, idx)}
                    />
                  </div>

                  <div className="xl:col-span-4 xl:border-l border-[#E5E7EB] dark:border-[#2A323D] xl:pl-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 text-xs">
                    <div className="min-w-0">
                      <div className="text-[#575F6C] dark:text-[#9AA4B2]">
                        Estação &amp; Artesão
                      </div>
                      <div className="mt-0.5 font-medium text-[#171C23] dark:text-[#EDF1FB] truncate">
                        {station?.name ?? 'Não atribuída'}
                      </div>
                      <div className="text-[#575F6C] dark:text-[#9AA4B2] truncate">
                        {artisan?.name ?? '—'} · Prazo: {batch.dueLabel}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[#575F6C] dark:text-[#9AA4B2]">Desvio Dimensional</div>
                      <div
                        className={`mt-0.5 font-mono font-semibold tabular-nums ${
                          batch.toleranceDeltaMm <= 0.15
                            ? 'text-[#2E7D32] dark:text-[#88D982]'
                            : 'text-[#D97706] dark:text-[#FBBF24]'
                        }`}
                      >
                        ±{batch.toleranceDeltaMm.toFixed(2)} mm
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* 6-Column Kanban Pipeline */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 items-start">
          {PRODUCTION_STAGES.map((stageName, stageIdx) => {
            const stageBatches = filteredBatches.filter(
              (b) => b.currentStageIndex === stageIdx
            );
            return (
              <div
                key={stageName}
                className="bg-[#EAEFF8]/70 dark:bg-[#191D23] border border-[#DEE2EC] dark:border-[#2A323D] rounded-lg p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between px-1 pb-1.5 border-b border-[#DEE2EC] dark:border-[#2A323D]">
                  <span className="font-display text-xs font-semibold text-[#171C23] dark:text-[#EDF1FB]">
                    {stageIdx + 1}. {stageName}
                  </span>
                  <span className="font-mono text-[11px] font-medium text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
                    {stageBatches.length}
                  </span>
                </div>

                {stageBatches.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#837469]">
                    Sem lotes
                  </div>
                ) : (
                  stageBatches.map((batch) => (
                    <div
                      key={batch.id}
                      className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded p-3 space-y-2 shadow-[0_2px_6px_-1px_rgba(30,35,42,0.05)]"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <LotTag lotId={batch.id} />
                        <span className="font-mono text-[10px] text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
                          {batch.quantity} un.
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#171C23] dark:text-[#EDF1FB] leading-snug">
                        {batch.itemName}
                      </p>
                      <div className="text-[11px] text-[#575F6C] dark:text-[#9AA4B2] font-mono tabular-nums">
                        {batch.species} · {batch.dueLabel}
                      </div>
                      <div className="pt-1 flex items-center justify-between gap-2 border-t border-[#E5E7EB] dark:border-[#2A323D]">
                        <span className="font-mono text-[10px] text-[#6F4315] dark:text-[#F9BA82]">
                          {batch.orderCode}
                        </span>
                        {stageIdx < PRODUCTION_STAGES.length - 1 && (
                          <button
                            type="button"
                            onClick={() => onAdvanceStage(batch.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#8B5A2B] hover:bg-[#704822] text-white text-[11px] font-medium cursor-pointer"
                          >
                            <span>Avançar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
