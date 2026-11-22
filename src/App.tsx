import { useEffect, useMemo, useState } from 'react';
import {
  AddLumberModal,
  CuttingPlanModal,
  NewBatchModal,
  PackSlipModal,
  ScrapModal,
} from './components/Modals';
import { InventoryCuttingView } from './components/InventoryCuttingView';
import { MarketplaceOrdersView } from './components/MarketplaceOrdersView';
import { ProductionOverview } from './components/ProductionOverview';
import { QualityScrapView } from './components/QualityScrapView';
import { Sidebar } from './components/Sidebar';
import { StationsArtisansView } from './components/StationsArtisansView';
import { TopBar } from './components/TopBar';
import {
  INITIAL_ARTISANS,
  INITIAL_BATCHES,
  INITIAL_LUMBER_LOTS,
  INITIAL_ORDERS,
  INITIAL_SCRAP_LEDGER,
  INITIAL_STATIONS,
} from './data/mockOperations';
import {
  LumberLot,
  MarketplaceOrder,
  PRODUCTION_STAGES,
  ProductionBatch,
  ScrapEntry,
  ScreenKey,
  WoodSpecies,
  WorkStation,
} from './types/operations';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>('overview');
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [batches, setBatches] = useState<ProductionBatch[]>(INITIAL_BATCHES);
  const [lumberLots, setLumberLots] = useState<LumberLot[]>(INITIAL_LUMBER_LOTS);
  const [stations, setStations] = useState<WorkStation[]>(INITIAL_STATIONS);
  const [artisans] = useState(INITIAL_ARTISANS);
  const [orders, setOrders] = useState<MarketplaceOrder[]>(INITIAL_ORDERS);
  const [scrapLedger, setScrapLedger] = useState<ScrapEntry[]>(INITIAL_SCRAP_LEDGER);
  const [sheetYieldPct, setSheetYieldPct] = useState(89.4);

  // Modal states
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);
  const [showAddLumberModal, setShowAddLumberModal] = useState(false);
  const [cuttingPlanTarget, setCuttingPlanTarget] = useState<{
    species: WoodSpecies;
    referenceId: string;
  } | null>(null);
  const [scrapTargetBatch, setScrapTargetBatch] = useState<ProductionBatch | null>(
    null
  );
  const [packSlipOrder, setPackSlipOrder] = useState<MarketplaceOrder | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const qcPassRatePct = useMemo(() => {
    const approved = batches.filter((b) => b.qcStatus === 'Aprovado').length;
    const total = Math.max(1, batches.length);
    return Math.min(99.2, 91.5 + (approved / total) * 6.5);
  }, [batches]);

  const sidebarCounts = useMemo(
    () => ({
      activeBatches: batches.filter((b) => b.currentStageIndex < 5).length,
      lowStockLots: lumberLots.filter(
        (l) => l.status === 'Estoque Baixo' || l.status === 'Rejeitado'
      ).length,
      pendingOrders: orders.filter((o) => !o.linkedBatchId).length,
      qcQueue: batches.filter(
        (b) => b.qcStatus === 'Pendente' || b.currentStageIndex === 3
      ).length,
    }),
    [batches, lumberLots, orders]
  );

  // Handlers
  const handleAdvanceStage = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        const nextIdx = Math.min(
          PRODUCTION_STAGES.length - 1,
          b.currentStageIndex + 1
        );
        const updatedTimes = [...b.stageTimesMin];
        if (updatedTimes[b.currentStageIndex] === 0) {
          updatedTimes[b.currentStageIndex] = 28;
        }
        return {
          ...b,
          currentStageIndex: nextIdx,
          stageTimesMin: updatedTimes,
          qcStatus: nextIdx >= 4 ? 'Aprovado' : b.qcStatus,
        };
      })
    );
  };

  const handleSetStage = (batchId: string, stageIndex: number) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          currentStageIndex: stageIndex,
          qcStatus: stageIndex >= 4 ? 'Aprovado' : b.qcStatus,
        };
      })
    );
  };

  const handleCreateBatch = (newBatch: ProductionBatch) => {
    setBatches((prev) => [newBatch, ...prev]);
    setActiveScreen('overview');
  };

  const handleAddLumberLot = (newLot: LumberLot) => {
    setLumberLots((prev) => [newLot, ...prev]);
  };

  const handleUpdateLotStatus = (lotId: string, status: LumberLot['status']) => {
    setLumberLots((prev) =>
      prev.map((l) => (l.lotId === lotId ? { ...l, status } : l))
    );
  };

  const handleReassignOperator = (stationId: string, artisanId: string) => {
    setStations((prev) =>
      prev.map((s) => (s.id === stationId ? { ...s, operatorId: artisanId } : s))
    );
  };

  const handleToggleMaintenance = (stationId: string) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id !== stationId) return s;
        const nextStatus =
          s.status === 'Manutenção' ? 'Operando' : 'Manutenção';
        return {
          ...s,
          status: nextStatus,
          utilizationPct: nextStatus === 'Manutenção' ? 20 : 84,
          spindleHours: nextStatus === 'Operando' ? 0 : s.spindleHours,
        };
      })
    );
  };

  const handleAssignBatchToStation = (
    stationId: string,
    batchId: string | null
  ) => {
    setStations((prev) =>
      prev.map((s) =>
        s.id === stationId ? { ...s, currentBatchId: batchId } : s
      )
    );
  };

  const handleDispatchOrderToCut = (order: MarketplaceOrder) => {
    const prefixMap: Record<WoodSpecies, string> = {
      Freijó: 'FRJ',
      Cumaru: 'CMR',
      Tauari: 'TAU',
      'Carvalho Americano': 'CRV',
      'MDF Naval': 'MDF',
      'Compensado Birch': 'BRC',
    };
    const newBatchId = `LOT#${Math.floor(8850 + Math.random() * 140)}-${prefixMap[order.species]}`;
    const newBatch: ProductionBatch = {
      id: newBatchId,
      itemName: order.productTitle,
      sku: `CP-${prefixMap[order.species]}-${order.dimensionsMm.l}`,
      species: order.species,
      channel: order.channel,
      orderCode: order.orderId,
      quantity: order.qty,
      currentStageIndex: 0,
      stageTimesMin: [14, 0, 0, 0, 0, 0],
      assignedStationId: 'st-2',
      assignedArtisanId: 'art-3',
      priority: 'Urgente',
      moisturePct: 8.8,
      dimensionsMm: order.dimensionsMm,
      dueLabel: order.slaDeadline,
      finishSpec: order.finishSpec,
      qcStatus: 'Pendente',
      toleranceDeltaMm: 0.11,
    };
    setBatches((prev) => [newBatch, ...prev]);
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === order.orderId
          ? { ...o, linkedBatchId: newBatchId, syncState: 'Sincronizado' }
          : o
      )
    );
  };

  const handleConfirmPackSlipPrint = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? { ...o, packSlipGenerated: true, syncState: 'Etiqueta Pronta' }
          : o
      )
    );
  };

  const handleApproveQC = (batchId: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              qcStatus: 'Aprovado',
              currentStageIndex: Math.max(4, b.currentStageIndex),
            }
          : b
      )
    );
  };

  const handleLogScrap = (entry: ScrapEntry) => {
    setScrapLedger((prev) => [entry, ...prev]);
    if (entry.disposition === 'Retrabalho') {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === entry.lotId ? { ...b, qcStatus: 'Retrabalho' } : b
        )
      );
    }
  };

  const primaryActionConfig = useMemo(() => {
    if (activeScreen === 'inventory') {
      return {
        label: 'Entrada de Lote',
        onClick: () => setShowAddLumberModal(true),
      };
    }
    return {
      label: 'Novo Lote de Produção',
      onClick: () => setShowNewBatchModal(true),
    };
  }, [activeScreen]);

  return (
    <div className="min-h-screen flex bg-[#F4F5F7] dark:bg-[#161A1F] text-[#171C23] dark:text-[#EDF1FB]">
      <Sidebar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        counts={sidebarCounts}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          activeScreen={activeScreen}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onPrimaryAction={primaryActionConfig.onClick}
          primaryActionLabel={primaryActionConfig.label}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1440px] w-full mx-auto">
          {activeScreen === 'overview' && (
            <ProductionOverview
              batches={batches}
              stations={stations}
              artisans={artisans}
              orders={orders}
              sheetYieldPct={sheetYieldPct}
              qcPassRatePct={qcPassRatePct}
              onAdvanceStage={handleAdvanceStage}
              onSetStage={handleSetStage}
              onOpenCuttingPlan={(species, referenceId) =>
                setCuttingPlanTarget({ species, referenceId })
              }
              onOpenScrapModal={(batch) => setScrapTargetBatch(batch)}
            />
          )}

          {activeScreen === 'inventory' && (
            <InventoryCuttingView
              lumberLots={lumberLots}
              onOpenCuttingPlan={(species, referenceId) =>
                setCuttingPlanTarget({ species, referenceId })
              }
              onOpenAddLumber={() => setShowAddLumberModal(true)}
              onUpdateLotStatus={handleUpdateLotStatus}
            />
          )}

          {activeScreen === 'stations' && (
            <StationsArtisansView
              stations={stations}
              artisans={artisans}
              batches={batches}
              onReassignOperator={handleReassignOperator}
              onToggleMaintenance={handleToggleMaintenance}
              onAssignBatch={handleAssignBatchToStation}
            />
          )}

          {activeScreen === 'marketplace' && (
            <MarketplaceOrdersView
              orders={orders}
              onOpenPackSlip={(order) => setPackSlipOrder(order)}
              onDispatchOrderToCut={handleDispatchOrderToCut}
            />
          )}

          {activeScreen === 'quality' && (
            <QualityScrapView
              batches={batches}
              scrapLedger={scrapLedger}
              onApproveQC={handleApproveQC}
              onOpenScrapModal={(batch) => setScrapTargetBatch(batch)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {showNewBatchModal && (
        <NewBatchModal
          stations={stations}
          artisans={artisans}
          onClose={() => setShowNewBatchModal(false)}
          onCreate={handleCreateBatch}
        />
      )}

      {showAddLumberModal && (
        <AddLumberModal
          onClose={() => setShowAddLumberModal(false)}
          onAdd={handleAddLumberLot}
        />
      )}

      {cuttingPlanTarget && (
        <CuttingPlanModal
          species={cuttingPlanTarget.species}
          referenceId={cuttingPlanTarget.referenceId}
          onClose={() => setCuttingPlanTarget(null)}
          onApplyOptimization={(yieldPct) => setSheetYieldPct(yieldPct)}
        />
      )}

      {scrapTargetBatch && (
        <ScrapModal
          batch={scrapTargetBatch}
          stationName={
            stations.find((s) => s.id === scrapTargetBatch.assignedStationId)
              ?.name ?? 'Bancada Marcenaria'
          }
          operatorName={
            artisans.find((a) => a.id === scrapTargetBatch.assignedArtisanId)
              ?.name ?? 'Henrique Vasconcelos'
          }
          onClose={() => setScrapTargetBatch(null)}
          onLogScrap={handleLogScrap}
        />
      )}

      {packSlipOrder && (
        <PackSlipModal
          order={packSlipOrder}
          onClose={() => setPackSlipOrder(null)}
          onConfirmPrint={handleConfirmPackSlipPrint}
        />
      )}
    </div>
  );
}
