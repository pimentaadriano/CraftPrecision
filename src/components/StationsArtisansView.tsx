import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  PauseCircle,
  Wrench,
} from 'lucide-react';
import { Artisan, ProductionBatch, WorkStation } from '../types/operations';
import { LotTag } from './ChannelBadge';

interface StationsArtisansViewProps {
  stations: WorkStation[];
  artisans: Artisan[];
  batches: ProductionBatch[];
  onReassignOperator: (stationId: string, artisanId: string) => void;
  onToggleMaintenance: (stationId: string) => void;
  onAssignBatch: (stationId: string, batchId: string | null) => void;
}

export const StationsArtisansView: React.FC<StationsArtisansViewProps> = ({
  stations,
  artisans,
  batches,
  onReassignOperator,
  onToggleMaintenance,
  onAssignBatch,
}) => {
  const artisanMap = Object.fromEntries(artisans.map((a) => [a.id, a]));
  const batchMap = Object.fromEntries(batches.map((b) => [b.id, b]));

  const renderStationStatus = (status: WorkStation['status']) => {
    switch (status) {
      case 'Operando':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E8F5E9] dark:bg-[#122D16] border border-[#2E7D32]/40 text-[11px] font-medium text-[#005B14] dark:text-[#88D982]">
            <CheckCircle2 className="w-3 h-3" />
            Operando
          </span>
        );
      case 'Manutenção':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3C7] dark:bg-[#3A280A] border border-[#D97706]/45 text-[11px] font-medium text-[#B45309] dark:text-[#FBBF24]">
            <Wrench className="w-3 h-3" />
            Manutenção / Calibração
          </span>
        );
      case 'Ocioso':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EAEFF8] dark:bg-[#2C3440] border border-[#BFC7D6] dark:border-[#3F4754] text-[11px] font-medium text-[#575F6C] dark:text-[#BFC7D6]">
            <PauseCircle className="w-3 h-3" />
            Em Espera
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Work Centers Grid */}
      <section aria-label="Alocação de Máquinas e Estações">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-semibold text-[#171C23] dark:text-[#EDF1FB]">
              Centros de Usinagem &amp; Bancadas de Marcenaria
            </h2>
            <p className="text-xs text-[#575F6C] dark:text-[#9AA4B2]">
              Carga operacional em tempo real, horas de spindle e alocação de mestres marceneiros.
            </p>
          </div>
          <span className="font-mono text-xs text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
            {stations.filter((s) => s.status === 'Operando').length}/{stations.length} estações ativas
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {stations.map((station) => {
            const operator = artisanMap[station.operatorId];
            const activeBatch = station.currentBatchId
              ? batchMap[station.currentBatchId]
              : null;
            const calibrationRatio =
              station.spindleHours / station.calibrationIntervalHours;
            const maintenanceDue = calibrationRatio >= 0.92;

            return (
              <article
                key={station.id}
                className={`bg-white dark:bg-[#1E232A] border rounded-lg p-5 space-y-4 ${
                  station.status === 'Manutenção'
                    ? 'border-[#D97706]/60'
                    : 'border-[#E5E7EB] dark:border-[#2A323D]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#8B5A2B] shrink-0" />
                      <h3 className="font-display text-[15px] font-semibold text-[#171C23] dark:text-[#EDF1FB] truncate">
                        {station.name}
                      </h3>
                    </div>
                    <p className="mt-0.5 text-xs text-[#575F6C] dark:text-[#9AA4B2]">
                      {station.machineModel} · {station.zone}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {renderStationStatus(station.status)}
                  </div>
                </div>

                {/* Utilization & Spindle Load Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5E7EB] dark:border-[#2A323D]">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#575F6C] dark:text-[#9AA4B2]">
                        Capacidade em Uso
                      </span>
                      <span className="font-mono font-semibold text-[#171C23] dark:text-[#EDF1FB] tabular-nums">
                        {station.utilizationPct}%
                      </span>
                    </div>
                    <div className="h-2 rounded-xs bg-[#EAEFF8] dark:bg-[#161A1F] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 ${
                          station.status === 'Manutenção'
                            ? 'bg-[#D97706]'
                            : 'bg-[#8B5A2B]'
                        }`}
                        style={{ width: `${station.utilizationPct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#575F6C] dark:text-[#9AA4B2]">
                        Troca de Fresa / Calibração
                      </span>
                      <span
                        className={`font-mono font-semibold tabular-nums ${
                          maintenanceDue
                            ? 'text-[#D97706] dark:text-[#FBBF24]'
                            : 'text-[#171C23] dark:text-[#EDF1FB]'
                        }`}
                      >
                        {station.spindleHours} / {station.calibrationIntervalHours} h
                      </span>
                    </div>
                    <div className="h-2 rounded-xs bg-[#EAEFF8] dark:bg-[#161A1F] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 ${
                          maintenanceDue ? 'bg-[#D97706]' : 'bg-[#2E7D32]'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.round(calibrationRatio * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {maintenanceDue && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded bg-[#FEF3C7]/70 dark:bg-[#3A280A]/70 border border-[#D97706]/35 text-xs text-[#92400E] dark:text-[#FBBF24]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Inspeção de ferramenta programada — limite de horas próximo.
                    </span>
                  </div>
                )}

                {/* Assigned Operator + Active Batch */}
                <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#2A323D] grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={`op-${station.id}`}
                      className="block text-[11px] font-medium text-[#575F6C] dark:text-[#9AA4B2] mb-1"
                    >
                      Artesão / Operador Responsável
                    </label>
                    <select
                      id={`op-${station.id}`}
                      value={station.operatorId}
                      onChange={(e) => onReassignOperator(station.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] text-xs font-medium text-[#171C23] dark:text-[#EDF1FB] focus:outline-none focus:border-[#8B5A2B]"
                    >
                      {artisans.map((art) => (
                        <option key={art.id} value={art.id}>
                          {art.name} ({art.efficiencyPct}%)
                        </option>
                      ))}
                    </select>
                    {operator && (
                      <p className="mt-1 text-[11px] text-[#575F6C] dark:text-[#9AA4B2] truncate">
                        {operator.specialization}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor={`batch-${station.id}`}
                      className="block text-[11px] font-medium text-[#575F6C] dark:text-[#9AA4B2] mb-1"
                    >
                      Ordem em Execução
                    </label>
                    <select
                      id={`batch-${station.id}`}
                      value={station.currentBatchId ?? ''}
                      onChange={(e) =>
                        onAssignBatch(station.id, e.target.value || null)
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#F8F9FF] dark:bg-[#161A1F] border border-[#DEE2EC] dark:border-[#2A323D] font-mono text-xs text-[#171C23] dark:text-[#EDF1FB] focus:outline-none focus:border-[#8B5A2B]"
                    >
                      <option value="">Sem lote alocado</option>
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.id} — {b.species}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      {activeBatch ? (
                        <span className="text-[11px] text-[#575F6C] dark:text-[#9AA4B2] truncate">
                          {activeBatch.itemName}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#837469]">
                          Estação livre para setup
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Station Action Bar */}
                <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#2A323D] flex items-center justify-between gap-2">
                  {activeBatch ? <LotTag lotId={activeBatch.id} /> : <span />}
                  <button
                    type="button"
                    onClick={() => onToggleMaintenance(station.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                      station.status === 'Manutenção'
                        ? 'bg-[#2E7D32] border-[#005B14] text-white hover:bg-[#005B14]'
                        : 'border-[#2C3440] dark:border-[#575F6C] text-[#2C3440] dark:text-[#EDF1FB] hover:bg-[#F0F4FD] dark:hover:bg-[#2C3440]'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>
                      {station.status === 'Manutenção'
                        ? 'Finalizar Manutenção'
                        : 'Parada p/ Calibração'}
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Master Joiners & Operators Roster */}
      <section className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] dark:border-[#2A323D]">
          <h2 className="font-display text-sm font-semibold text-[#171C23] dark:text-[#EDF1FB]">
            Quadro de Artesãos &amp; Especialistas
          </h2>
        </div>
        <div className="divide-y divide-[#E5E7EB] dark:divide-[#2A323D]">
          {artisans.map((art) => {
            const assignedStation = stations.find((s) => s.operatorId === art.id);
            return (
              <div
                key={art.id}
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded bg-[#2C3440] dark:bg-[#12161B] text-[#F9BA82] border border-[#3F4754] flex items-center justify-center font-mono text-xs font-semibold shrink-0">
                    {art.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#171C23] dark:text-[#EDF1FB] truncate">
                        {art.name}
                      </span>
                      <span className="text-xs text-[#575F6C] dark:text-[#9AA4B2]">
                        · {art.role}
                      </span>
                    </div>
                    <p className="text-xs text-[#575F6C] dark:text-[#9AA4B2] truncate">
                      {art.specialization} · {art.shift}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0 text-xs">
                  <div className="text-right">
                    <span className="block text-[#575F6C] dark:text-[#9AA4B2]">
                      Estação Atual
                    </span>
                    <span className="font-medium text-[#171C23] dark:text-[#EDF1FB]">
                      {assignedStation?.name ?? 'Disponível'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[#575F6C] dark:text-[#9AA4B2]">
                      Eficiência
                    </span>
                    <span className="font-mono font-semibold text-[#2E7D32] dark:text-[#88D982] tabular-nums">
                      {art.efficiencyPct}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
