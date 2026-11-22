import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Printer,
  Scissors,
  X,
} from 'lucide-react';
import {
  Artisan,
  GrainDirection,
  LumberLot,
  MarketplaceChannel,
  MarketplaceOrder,
  ProductionBatch,
  ScrapEntry,
  WoodSpecies,
  WorkStation,
} from '../types/operations';
import { ChannelBadge, LotTag } from './ChannelBadge';

/* -------------------------------------------------------------------------- */
/* 1. New Production Batch Modal                                              */
/* -------------------------------------------------------------------------- */
interface NewBatchModalProps {
  stations: WorkStation[];
  artisans: Artisan[];
  onClose: () => void;
  onCreate: (batch: ProductionBatch) => void;
}

export const NewBatchModal: React.FC<NewBatchModalProps> = ({
  stations,
  artisans,
  onClose,
  onCreate,
}) => {
  const [itemName, setItemName] = useState('Aparador Ripado Freijó 140cm');
  const [species, setSpecies] = useState<WoodSpecies>('Freijó');
  const [channel, setChannel] = useState<MarketplaceChannel>('Mercado Livre');
  const [orderCode, setOrderCode] = useState(
    `MLB-${Math.floor(90420000 + Math.random() * 70000)}`
  );
  const [quantity, setQuantity] = useState(4);
  const [t, setT] = useState(24);
  const [w, setW] = useState(400);
  const [l, setL] = useState(1400);
  const [stationId, setStationId] = useState(stations[0]?.id ?? 'st-1');
  const [priority, setPriority] = useState<ProductionBatch['priority']>('Padrão');
  const [finishSpec, setFinishSpec] = useState('Óleo Rubio Monocoat Pure 2C');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefixMap: Record<WoodSpecies, string> = {
      Freijó: 'FRJ',
      Cumaru: 'CMR',
      Tauari: 'TAU',
      'Carvalho Americano': 'CRV',
      'MDF Naval': 'MDF',
      'Compensado Birch': 'BRC',
    };
    const st = stations.find((s) => s.id === stationId);
    const artisanId = st?.operatorId ?? artisans[0]?.id ?? 'art-1';
    const newId = `LOT#${Math.floor(8850 + Math.random() * 140)}-${prefixMap[species]}`;

    onCreate({
      id: newId,
      itemName: itemName.trim() || 'Peça Sob Medida',
      sku: `CP-${prefixMap[species]}-${l}`,
      species,
      channel,
      orderCode: orderCode.trim() || 'PRJ-2026-099',
      quantity: Math.max(1, quantity),
      currentStageIndex: 0,
      stageTimesMin: [12, 0, 0, 0, 0, 0],
      assignedStationId: stationId,
      assignedArtisanId: artisanId,
      priority,
      moisturePct: 8.9,
      dimensionsMm: { t, w, l },
      dueLabel: priority === 'Urgente' ? 'Hoje, 18:00' : '25 Nov, 14:00',
      finishSpec,
      qcStatus: 'Pendente',
      toleranceDeltaMm: 0.1,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#14181D]/65 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-new-batch"
    >
      <div className="bg-white dark:bg-[#1E232A] border border-[#1E232A] dark:border-[#3F4754] rounded-xl w-full max-w-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-[#2C3440] dark:bg-[#12161B] text-white flex items-center justify-between">
          <h2 id="modal-new-batch" className="font-display text-base font-semibold">
            Abrir Novo Lote de Produção
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-[#BFC7D6] hover:text-white cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
              Descrição da Peça / Móvel
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB] focus:outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Espécie / Chapa
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as WoodSpecies)}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              >
                <option value="Freijó">Freijó</option>
                <option value="Cumaru">Cumaru</option>
                <option value="Tauari">Tauari</option>
                <option value="Carvalho Americano">Carvalho Americano</option>
                <option value="MDF Naval">MDF Naval</option>
                <option value="Compensado Birch">Compensado Birch</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Canal de Venda
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as MarketplaceChannel)}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              >
                <option value="Mercado Livre">Mercado Livre</option>
                <option value="Shopee">Shopee</option>
                <option value="Amazon">Amazon</option>
                <option value="Elo7">Elo7</option>
                <option value="B2B Sob Medida">B2B Sob Medida</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Código do Pedido
              </label>
              <input
                type="text"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Espessura (mm)
              </label>
              <input
                type="number"
                min={3}
                value={t}
                onChange={(e) => setT(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Largura (mm)
              </label>
              <input
                type="number"
                min={50}
                value={w}
                onChange={(e) => setW(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Comprimento (mm)
              </label>
              <input
                type="number"
                min={100}
                value={l}
                onChange={(e) => setL(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Quantidade
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Estação Inicial
              </label>
              <select
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as ProductionBatch['priority'])
                }
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              >
                <option value="Urgente">Urgente</option>
                <option value="Padrão">Padrão</option>
                <option value="Agendado">Agendado</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Acabamento
              </label>
              <input
                type="text"
                value={finishSpec}
                onChange={(e) => setFinishSpec(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#2A323D] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#2C3440] dark:border-[#575F6C] text-xs font-semibold text-[#2C3440] dark:text-[#EDF1FB] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#8B5A2B] hover:bg-[#704822] text-white text-xs font-semibold cursor-pointer"
            >
              Iniciar Lote em Corte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Add Lumber Inventory Lot Modal                                          */
/* -------------------------------------------------------------------------- */
interface AddLumberModalProps {
  onClose: () => void;
  onAdd: (lot: LumberLot) => void;
}

export const AddLumberModal: React.FC<AddLumberModalProps> = ({
  onClose,
  onAdd,
}) => {
  const [species, setSpecies] = useState<WoodSpecies>('Freijó');
  const [t, setT] = useState(25);
  const [w, setW] = useState(300);
  const [l, setL] = useState(3000);
  const [unitsAvailable, setUnitsAvailable] = useState(20);
  const [moisturePct, setMoisturePct] = useState(9.1);
  const [grainDirection, setGrainDirection] =
    useState<GrainDirection>('Longitudinal');
  const [certification, setCertification] =
    useState<LumberLot['certification']>('FSC 100%');
  const [locationBay, setLocationBay] = useState('Rack A1 · Secagem');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prefixMap: Record<WoodSpecies, string> = {
      Freijó: 'FRJ',
      Cumaru: 'CMR',
      Tauari: 'TAU',
      'Carvalho Americano': 'CRV',
      'MDF Naval': 'MDF',
      'Compensado Birch': 'BRC',
    };
    const m3 = ((t * w * l) / 1_000_000_000) * unitsAvailable;
    onAdd({
      lotId: `MAT#${Math.floor(430 + Math.random() * 90)}-${prefixMap[species]}`,
      species,
      dimensionsMm: { t, w, l },
      unitsAvailable,
      cubicMeters: Number(m3.toFixed(3)),
      moisturePct,
      grainDirection,
      certification,
      status: moisturePct > 10.5 ? 'Rejeitado' : 'Disponível',
      locationBay,
      costPerUnitBrl: 310,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#14181D]/65 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-lumber"
    >
      <div className="bg-white dark:bg-[#1E232A] border border-[#1E232A] dark:border-[#3F4754] rounded-xl w-full max-w-lg overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-[#2C3440] dark:bg-[#12161B] text-white flex items-center justify-between">
          <h2 id="modal-add-lumber" className="font-display text-base font-semibold">
            Registrar Entrada de Madeira / Chapa
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-[#BFC7D6] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Espécie / Material
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as WoodSpecies)}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              >
                <option value="Freijó">Freijó</option>
                <option value="Cumaru">Cumaru</option>
                <option value="Tauari">Tauari</option>
                <option value="Carvalho Americano">Carvalho Americano</option>
                <option value="MDF Naval">MDF Naval</option>
                <option value="Compensado Birch">Compensado Birch</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Umidade Medida (% MC)
              </label>
              <input
                type="number"
                step="0.1"
                value={moisturePct}
                onChange={(e) => setMoisturePct(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Esp. (mm)
              </label>
              <input
                type="number"
                value={t}
                onChange={(e) => setT(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Larg. (mm)
              </label>
              <input
                type="number"
                value={w}
                onChange={(e) => setW(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Comp. (mm)
              </label>
              <input
                type="number"
                value={l}
                onChange={(e) => setL(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Unidades
              </label>
              <input
                type="number"
                min={1}
                value={unitsAvailable}
                onChange={(e) => setUnitsAvailable(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Sentido do Veio
              </label>
              <select
                value={grainDirection}
                onChange={(e) =>
                  setGrainDirection(e.target.value as GrainDirection)
                }
                className="w-full px-2.5 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              >
                <option value="Longitudinal">Longitudinal</option>
                <option value="Transversal">Transversal</option>
                <option value="Livre">Livre</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Certificação
              </label>
              <select
                value={certification}
                onChange={(e) =>
                  setCertification(e.target.value as LumberLot['certification'])
                }
                className="w-full px-2.5 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              >
                <option value="FSC 100%">FSC 100%</option>
                <option value="DOF Validado">DOF Validado</option>
                <option value="CARB2">CARB2</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Baia / Rack
              </label>
              <input
                type="text"
                value={locationBay}
                onChange={(e) => setLocationBay(e.target.value)}
                className="w-full px-2.5 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#2A323D] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#2C3440] dark:border-[#575F6C] text-xs font-semibold text-[#2C3440] dark:text-[#EDF1FB] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#8B5A2B] hover:bg-[#704822] text-white text-xs font-semibold cursor-pointer"
            >
              Confirmar Entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Interactive Cutting Plan Optimizer (Nesting) Modal                      */
/* -------------------------------------------------------------------------- */
interface CuttingPlanModalProps {
  species: WoodSpecies;
  referenceId: string;
  onClose: () => void;
  onApplyOptimization: (yieldPct: number) => void;
}

export const CuttingPlanModal: React.FC<CuttingPlanModalProps> = ({
  species,
  referenceId,
  onClose,
  onApplyOptimization,
}) => {
  const [kerfMm, setKerfMm] = useState<3.2 | 4.0>(3.2);
  const [lockGrain, setLockGrain] = useState(true);
  const [applied, setApplied] = useState(false);

  const sheetW = 2750;
  const sheetH = 1830;

  const parts = useMemo(() => {
    if (lockGrain) {
      return [
        { id: 'P1', label: 'Tampo 1600×420', x: 15, y: 15, w: 1600, h: 420 },
        { id: 'P2', label: 'Tampo 1600×420', x: 15, y: 445, w: 1600, h: 420 },
        { id: 'P3', label: 'Base 1600×400', x: 15, y: 875, w: 1600, h: 400 },
        { id: 'P4', label: 'Lateral 780×420', x: 1630, y: 15, w: 780, h: 420 },
        { id: 'P5', label: 'Lateral 780×420', x: 1630, y: 445, w: 780, h: 420 },
        { id: 'P6', label: 'Prateleira 1100×360', x: 15, y: 1285, w: 1100, h: 360 },
        { id: 'P7', label: 'Sarrafo 1100×140', x: 1125, y: 1285, w: 1100, h: 140 },
        { id: 'P8', label: 'Fundo 1080×380', x: 1630, y: 875, w: 1080, h: 380 },
      ];
    }
    return [
      { id: 'P1', label: 'Tampo 1600×420', x: 15, y: 15, w: 1600, h: 420 },
      { id: 'P2', label: 'Tampo 1600×420', x: 15, y: 445, w: 1600, h: 420 },
      { id: 'P3', label: 'Base 1600×400', x: 15, y: 875, w: 1600, h: 400 },
      { id: 'P4', label: 'Lateral 420×780', x: 1630, y: 15, w: 420, h: 780 },
      { id: 'P5', label: 'Lateral 420×780', x: 2060, y: 15, w: 420, h: 780 },
      { id: 'P6', label: 'Prateleira 1100×360', x: 15, y: 1285, w: 1100, h: 360 },
      { id: 'P7', label: 'Fundo 1080×380', x: 1125, y: 1285, w: 1080, h: 380 },
      { id: 'P8', label: 'Sarrafo 1100×140', x: 1630, y: 805, w: 1100, h: 140 },
      { id: 'P9', label: 'Travessa 960×240', x: 1630, y: 955, w: 960, h: 240 },
    ];
  }, [lockGrain]);

  const yieldPct = useMemo(() => {
    const usedArea = parts.reduce((acc, p) => acc + p.w * p.h, 0);
    const kerfPenalty = kerfMm === 4.0 ? 1.4 : 0.0;
    const raw = (usedArea / (sheetW * sheetH)) * 100 - kerfPenalty;
    return Number(Math.min(96.5, Math.max(72, raw + 12.2)).toFixed(1));
  }, [parts, kerfMm]);

  const handleSendToSaw = () => {
    setApplied(true);
    onApplyOptimization(yieldPct);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#14181D]/65 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cutting"
    >
      <div className="bg-white dark:bg-[#1E232A] border border-[#1E232A] dark:border-[#3F4754] rounded-xl w-full max-w-4xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-[#2C3440] dark:bg-[#12161B] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Scissors className="w-4 h-4 text-[#F9BA82] shrink-0" />
            <div className="min-w-0">
              <h2 id="modal-cutting" className="font-display text-base font-semibold truncate">
                Otimizador de Plano de Corte (Nesting) — {species}
              </h2>
              <p className="font-mono text-[11px] text-[#BFC7D6]">
                Referência: {referenceId} · Chapa Padrão {sheetW} × {sheetH} mm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-[#BFC7D6] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Controls Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB] dark:border-[#2A323D]">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#575F6C] dark:text-[#9AA4B2]">
                  Espessura da Serra (Kerf):
                </span>
                <div className="flex items-center p-0.5 bg-[#EAEFF8] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] rounded">
                  {([3.2, 4.0] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKerfMm(k)}
                      className={`px-2.5 py-1 rounded font-mono text-[11px] cursor-pointer ${
                        kerfMm === k
                          ? 'bg-white dark:bg-[#2C3440] text-[#171C23] dark:text-white font-semibold'
                          : 'text-[#575F6C] dark:text-[#9AA4B2]'
                      }`}
                    >
                      {k.toFixed(1)} mm
                    </button>
                  ))}
                </div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={lockGrain}
                  onChange={(e) => setLockGrain(e.target.checked)}
                  className="accent-[#8B5A2B] w-3.5 h-3.5"
                />
                <span className="font-medium text-[#171C23] dark:text-[#EDF1FB]">
                  Travar Sentido do Veio
                </span>
              </label>
            </div>

            <div className="flex items-center gap-4 font-mono text-xs tabular-nums">
              <span>
                Peças:{' '}
                <strong className="text-[#171C23] dark:text-[#EDF1FB]">
                  {parts.length}
                </strong>
              </span>
              <span>
                Aproveitamento:{' '}
                <strong className="text-[#2E7D32] dark:text-[#88D982]">
                  {yieldPct.toFixed(1)}%
                </strong>
              </span>
              <span>
                Sobra útil:{' '}
                <strong className="text-[#6F4315] dark:text-[#F9BA82]">
                  {(100 - yieldPct).toFixed(1)}%
                </strong>
              </span>
            </div>
          </div>

          {/* CAD Sheet Nesting SVG */}
          <div className="bg-[#161A1F] border border-[#2C3440] rounded-lg p-4">
            <svg
              viewBox={`0 0 ${sheetW} ${sheetH}`}
              className="w-full h-auto max-h-[340px] block"
              role="img"
              aria-label="Diagrama de plano de corte em chapa"
            >
              {/* Raw Sheet Background */}
              <rect
                x={0}
                y={0}
                width={sheetW}
                height={sheetH}
                fill="#222831"
                stroke="#575F6C"
                strokeWidth={6}
              />
              {/* Subtle Grain Lines */}
              {[300, 600, 900, 1200, 1500].map((y) => (
                <line
                  key={y}
                  x1={0}
                  y1={y}
                  x2={sheetW}
                  y2={y}
                  stroke="#2C3440"
                  strokeWidth={2}
                  strokeDasharray="18 14"
                />
              ))}

              {/* Nested Cut Pieces */}
              {parts.map((p) => (
                <g key={p.id}>
                  <rect
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={p.h}
                    fill="#8B5A2B"
                    fillOpacity={0.82}
                    stroke="#F9BA82"
                    strokeWidth={kerfMm * 1.4}
                  />
                  <text
                    x={p.x + p.w / 2}
                    y={p.y + p.h / 2 - 14}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize={44}
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                  >
                    {p.id}
                  </text>
                  <text
                    x={p.x + p.w / 2}
                    y={p.y + p.h / 2 + 34}
                    textAnchor="middle"
                    fill="#FFDCC1"
                    fontSize={34}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {p.w}×{p.h}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Footer Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-[#575F6C] dark:text-[#9AA4B2]">
              {applied ? (
                <span className="inline-flex items-center gap-1.5 text-[#2E7D32] dark:text-[#88D982] font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Arquivo G-Code / Cutlist enviado para Seccionadora Automática.
                </span>
              ) : (
                'Pronto para exportar sequência otimizada para Homag Sawteq B-300.'
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-[#2C3440] dark:border-[#575F6C] text-xs font-semibold text-[#2C3440] dark:text-[#EDF1FB] cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={handleSendToSaw}
                className="px-4 py-2 rounded bg-[#8B5A2B] hover:bg-[#704822] text-white text-xs font-semibold cursor-pointer"
              >
                Aplicar &amp; Enviar p/ Seccionadora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. Log Scrap / Rework Modal                                                */
/* -------------------------------------------------------------------------- */
interface ScrapModalProps {
  batch: ProductionBatch;
  stationName: string;
  operatorName: string;
  onClose: () => void;
  onLogScrap: (entry: ScrapEntry) => void;
}

export const ScrapModal: React.FC<ScrapModalProps> = ({
  batch,
  stationName,
  operatorName,
  onClose,
  onLogScrap,
}) => {
  const [reason, setReason] = useState(
    'Trinca longitudinal detectada após usinagem de encaixe'
  );
  const [disposition, setDisposition] =
    useState<ScrapEntry['disposition']>('Retrabalho');
  const [volumeM3, setVolumeM3] = useState(0.0124);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogScrap({
      id: `SCR-${Math.floor(1045 + Math.random() * 89)}`,
      timestamp: '22 Nov · Agora',
      lotId: batch.id,
      species: batch.species,
      dimensionsMm: batch.dimensionsMm,
      volumeM3,
      reason: reason.trim() || 'Ocorrência dimensional',
      stationName,
      operatorName,
      disposition,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#14181D]/65 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-scrap"
    >
      <div className="bg-white dark:bg-[#1E232A] border border-[#1E232A] dark:border-[#3F4754] rounded-xl w-full max-w-md overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-[#BA1A1A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <h2 id="modal-scrap" className="font-display text-base font-semibold">
              Registrar Refugo / Retrabalho
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-[#2A323D]">
            <LotTag lotId={batch.id} />
            <span className="font-medium text-[#575F6C] dark:text-[#9AA4B2]">
              {batch.species}
            </span>
          </div>

          <div>
            <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
              Motivo Técnico da Ocorrência
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB] focus:outline-none focus:border-[#DC2626]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Destinação
              </label>
              <select
                value={disposition}
                onChange={(e) =>
                  setDisposition(e.target.value as ScrapEntry['disposition'])
                }
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-[#171C23] dark:text-[#EDF1FB]"
              >
                <option value="Retrabalho">Retrabalho</option>
                <option value="Reaproveitamento">Reaproveitamento</option>
                <option value="Descarte">Descarte</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#171C23] dark:text-[#EDF1FB] mb-1">
                Volume Afetado (m³)
              </label>
              <input
                type="number"
                step="0.0005"
                min={0.0005}
                value={volumeM3}
                onChange={(e) => setVolumeM3(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-[#171C23] dark:text-[#EDF1FB]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#2A323D] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-[#2C3440] dark:border-[#575F6C] text-xs font-semibold text-[#2C3440] dark:text-[#EDF1FB] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#DC2626] hover:bg-[#BA1A1A] text-white text-xs font-semibold cursor-pointer"
            >
              Confirmar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. Marketplace Pack-Slip & Shipping Label Modal                            */
/* -------------------------------------------------------------------------- */
interface PackSlipModalProps {
  order: MarketplaceOrder;
  onClose: () => void;
  onConfirmPrint: (orderId: string) => void;
}

export const PackSlipModal: React.FC<PackSlipModalProps> = ({
  order,
  onClose,
  onConfirmPrint,
}) => {
  const [printed, setPrinted] = useState(order.packSlipGenerated);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#14181D]/65 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-packslip"
    >
      <div className="bg-white dark:bg-[#1E232A] border border-[#1E232A] dark:border-[#3F4754] rounded-xl w-full max-w-lg overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-[#2C3440] dark:bg-[#12161B] text-white flex items-center justify-between">
          <h2 id="modal-packslip" className="font-display text-base font-semibold">
            Romaneio de Expedição &amp; Etiqueta
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-[#BFC7D6] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Simulated Physical Shipping Label Card */}
          <div className="border-2 border-[#171C23] dark:border-[#575F6C] rounded p-4 bg-[#F8F9FF] dark:bg-[#161A1F] space-y-3">
            <div className="flex items-center justify-between border-b border-[#DEE2EC] dark:border-[#2A323D] pb-3">
              <ChannelBadge channel={order.channel} orderCode={order.orderId} />
              <span className="font-mono text-[11px] font-semibold text-[#171C23] dark:text-[#EDF1FB]">
                SLA: {order.slaDeadline}
              </span>
            </div>

            <div>
              <div className="text-[11px] text-[#575F6C] dark:text-[#9AA4B2]">
                Destinatário
              </div>
              <div className="text-sm font-semibold text-[#171C23] dark:text-[#EDF1FB]">
                {order.customerName}
              </div>
              <div className="text-xs text-[#575F6C] dark:text-[#9AA4B2]">
                {order.cityState}
              </div>
            </div>

            <div className="pt-2 border-t border-[#DEE2EC] dark:border-[#2A323D] space-y-1">
              <div className="font-semibold text-[#171C23] dark:text-[#EDF1FB]">
                {order.qty}× {order.productTitle}
              </div>
              <div className="font-mono text-[11px] text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
                {order.species} · {order.dimensionsMm.t}×{order.dimensionsMm.w}×{order.dimensionsMm.l} mm · {order.finishSpec}
              </div>
            </div>

            {/* Clean Monospace Barcode Representation */}
            <div className="pt-3 border-t border-dashed border-[#837469] flex items-center justify-between">
              <div className="flex items-center gap-[2px] h-7" aria-hidden="true">
                {[3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 2, 1, 3, 2, 1, 2, 4, 1, 2, 1].map(
                  (w, i) => (
                    <span
                      key={i}
                      className="h-full bg-[#171C23] dark:bg-[#EDF1FB]"
                      style={{ width: `${w * 2}px` }}
                    />
                  )
                )}
              </div>
              <span className="font-mono text-xs font-semibold text-[#171C23] dark:text-[#EDF1FB]">
                {order.orderId}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {printed ? (
              <span className="inline-flex items-center gap-1.5 text-[#2E7D32] dark:text-[#88D982] font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Romaneio emitido e vinculado à fila de coleta.
              </span>
            ) : (
              <span className="text-[#575F6C] dark:text-[#9AA4B2]">
                Pronto para impressão térmica 100×150mm.
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-[#2C3440] dark:border-[#575F6C] text-xs font-semibold text-[#2C3440] dark:text-[#EDF1FB] cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrinted(true);
                  onConfirmPrint(order.orderId);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#8B5A2B] hover:bg-[#704822] text-white text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{printed ? 'Reimprimir Etiqueta' : 'Emitir & Imprimir'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
