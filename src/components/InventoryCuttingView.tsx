import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  Scissors,
  Search,
  XCircle,
} from 'lucide-react';
import {
  GrainDirection,
  LumberLot,
  WoodSpecies,
} from '../types/operations';
import { LotTag } from './ChannelBadge';

interface InventoryCuttingViewProps {
  lumberLots: LumberLot[];
  onOpenCuttingPlan: (species: WoodSpecies, lotId: string) => void;
  onOpenAddLumber: () => void;
  onUpdateLotStatus: (lotId: string, status: LumberLot['status']) => void;
}

const SPECIES_OPTIONS: Array<'Todas' | WoodSpecies> = [
  'Todas',
  'Freijó',
  'Cumaru',
  'Tauari',
  'Carvalho Americano',
  'MDF Naval',
  'Compensado Birch',
];

const GRAIN_OPTIONS: Array<'Todos' | GrainDirection> = [
  'Todos',
  'Longitudinal',
  'Transversal',
  'Livre',
];

const STATUS_OPTIONS: Array<'Todos' | LumberLot['status']> = [
  'Todos',
  'Disponível',
  'Alocado',
  'Estoque Baixo',
  'Rejeitado',
];

export const InventoryCuttingView: React.FC<InventoryCuttingViewProps> = ({
  lumberLots,
  onOpenCuttingPlan,
  onOpenAddLumber,
  onUpdateLotStatus,
}) => {
  const [speciesFilter, setSpeciesFilter] = useState<'Todas' | WoodSpecies>('Todas');
  const [grainFilter, setGrainFilter] = useState<'Todos' | GrainDirection>('Todos');
  const [statusFilter, setStatusFilter] = useState<'Todos' | LumberLot['status']>('Todos');
  const [search, setSearch] = useState('');

  const filteredLots = useMemo(() => {
    return lumberLots.filter((lot) => {
      if (speciesFilter !== 'Todas' && lot.species !== speciesFilter) return false;
      if (grainFilter !== 'Todos' && lot.grainDirection !== grainFilter) return false;
      if (statusFilter !== 'Todos' && lot.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          lot.lotId.toLowerCase().includes(q) ||
          lot.species.toLowerCase().includes(q) ||
          lot.locationBay.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [lumberLots, speciesFilter, grainFilter, statusFilter, search]);

  const totalCubicMeters = useMemo(
    () => filteredLots.reduce((acc, l) => acc + l.cubicMeters, 0),
    [filteredLots]
  );
  const totalUnits = useMemo(
    () => filteredLots.reduce((acc, l) => acc + l.unitsAvailable, 0),
    [filteredLots]
  );

  const renderStatusBadge = (status: LumberLot['status']) => {
    switch (status) {
      case 'Disponível':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E8F5E9] dark:bg-[#122D16] border border-[#2E7D32]/40 text-[11px] font-medium text-[#005B14] dark:text-[#88D982] whitespace-nowrap">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            Disponível
          </span>
        );
      case 'Alocado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E6EFFA] dark:bg-[#13263E] border border-[#1D4E89]/40 text-[11px] font-medium text-[#1D4E89] dark:text-[#93C5FD] whitespace-nowrap">
            Alocado em OP
          </span>
        );
      case 'Estoque Baixo':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3C7] dark:bg-[#3A280A] border border-[#D97706]/45 text-[11px] font-medium text-[#B45309] dark:text-[#FBBF24] whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 shrink-0" />
            Estoque Baixo
          </span>
        );
      case 'Rejeitado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFDAD6] dark:bg-[#3B1313] border border-[#DC2626]/45 text-[11px] font-medium text-[#93000A] dark:text-[#FCA5A5] whitespace-nowrap">
            <XCircle className="w-3 h-3 shrink-0" />
            Quarentena
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Summary Header & Quick Filter Bar */}
      <section className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-semibold text-[#171C23] dark:text-[#EDF1FB]">
              Estoque de Madeiras Maciças &amp; Chapas Técnicas
            </h2>
            <p className="text-xs text-[#575F6C] dark:text-[#9AA4B2] mt-0.5 tabular-nums">
              <span className="font-mono font-medium text-[#171C23] dark:text-[#EDF1FB]">
                {filteredLots.length}
              </span>{' '}
              lotes filtrados ·{' '}
              <span className="font-mono font-medium text-[#171C23] dark:text-[#EDF1FB]">
                {totalUnits}
              </span>{' '}
              peças/chapas ·{' '}
              <span className="font-mono font-medium text-[#6F4315] dark:text-[#F9BA82]">
                {totalCubicMeters.toFixed(3)} m³
              </span>{' '}
              em estoque
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddLumber}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-[#2C3440] dark:border-[#575F6C] text-xs font-semibold text-[#2C3440] dark:text-[#EDF1FB] hover:bg-[#F0F4FD] dark:hover:bg-[#2C3440] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Entrada de Lote</span>
          </button>
        </div>

        {/* Integrated Quick-Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#E5E7EB] dark:border-[#2A323D]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#575F6C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar MAT#, espécie ou rack..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-xs text-[#171C23] dark:text-[#EDF1FB] placeholder:text-[#837469] focus:outline-none focus:border-[#8B5A2B]"
            />
          </div>

          <select
            aria-label="Filtrar por espécie"
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value as 'Todas' | WoodSpecies)}
            className="px-3 py-1.5 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-xs text-[#171C23] dark:text-[#EDF1FB] focus:outline-none focus:border-[#8B5A2B]"
          >
            {SPECIES_OPTIONS.map((sp) => (
              <option key={sp} value={sp}>
                Espécie: {sp}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por sentido de veio"
            value={grainFilter}
            onChange={(e) => setGrainFilter(e.target.value as 'Todos' | GrainDirection)}
            className="px-3 py-1.5 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-xs text-[#171C23] dark:text-[#EDF1FB] focus:outline-none focus:border-[#8B5A2B]"
          >
            {GRAIN_OPTIONS.map((gr) => (
              <option key={gr} value={gr}>
                Veio: {gr}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por status do lote"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'Todos' | LumberLot['status'])}
            className="px-3 py-1.5 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-xs text-[#171C23] dark:text-[#EDF1FB] focus:outline-none focus:border-[#8B5A2B]"
          >
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Dense Manufacturing Table */}
      <section className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#2C3440] dark:bg-[#12161B] text-[#EDF1FB] text-[11px] font-medium">
                <th className="py-2.5 px-4 whitespace-nowrap">Lote</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Espécie / Material</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">
                  Dimensões (E × L × C mm)
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Qtd</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Volume (m³)</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Umidade</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Veio</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Certificação</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-4 whitespace-nowrap text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2A323D] text-[13px]">
              {filteredLots.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-sm text-[#575F6C] dark:text-[#9AA4B2]">
                    Nenhum material corresponde aos filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredLots.map((lot, idx) => {
                  const highMoisture = lot.moisturePct > 10.5;
                  return (
                    <tr
                      key={lot.lotId}
                      className={`h-10 transition-colors hover:bg-[#FFF6EE]/60 dark:hover:bg-[#262C35] ${
                        idx % 2 === 0
                          ? 'bg-white dark:bg-[#1E232A]'
                          : 'bg-[#F8F9FA] dark:bg-[#191D23]'
                      }`}
                    >
                      <td className="py-2 px-4 whitespace-nowrap">
                        <LotTag lotId={lot.lotId} />
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="font-medium text-[#171C23] dark:text-[#EDF1FB]">
                          {lot.species}
                        </div>
                        <div className="text-[11px] text-[#575F6C] dark:text-[#9AA4B2]">
                          {lot.locationBay}
                        </div>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-right font-mono text-xs text-[#171C23] dark:text-[#D6DAE4] tabular-nums">
                        {lot.dimensionsMm.t} × {lot.dimensionsMm.w} × {lot.dimensionsMm.l}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-right font-mono text-xs font-semibold text-[#171C23] dark:text-[#EDF1FB] tabular-nums">
                        {lot.unitsAvailable}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-right font-mono text-xs text-[#575F6C] dark:text-[#BFC7D6] tabular-nums">
                        {lot.cubicMeters.toFixed(3)}
                      </td>
                      <td
                        className={`py-2 px-3 whitespace-nowrap text-right font-mono text-xs font-medium tabular-nums ${
                          highMoisture
                            ? 'text-[#DC2626] dark:text-[#FCA5A5]'
                            : 'text-[#2E7D32] dark:text-[#88D982]'
                        }`}
                      >
                        {lot.moisturePct.toFixed(1)}%
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-xs text-[#575F6C] dark:text-[#BFC7D6]">
                        {lot.grainDirection}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px] text-[#171C23] dark:text-[#D6DAE4]">
                        {lot.certification}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        {renderStatusBadge(lot.status)}
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenCuttingPlan(lot.species, lot.lotId)}
                            disabled={lot.status === 'Rejeitado'}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#2C3440] dark:border-[#575F6C] text-[11px] font-medium text-[#2C3440] dark:text-[#EDF1FB] hover:bg-[#F0F4FD] dark:hover:bg-[#2C3440] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Scissors className="w-3 h-3" />
                            <span>Otimizar</span>
                          </button>
                          {lot.status === 'Rejeitado' ? (
                            <button
                              type="button"
                              onClick={() => onUpdateLotStatus(lot.lotId, 'Disponível')}
                              className="px-2 py-1 rounded bg-[#2E7D32] text-white text-[11px] font-medium hover:bg-[#005B14] cursor-pointer"
                            >
                              Liberar
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
