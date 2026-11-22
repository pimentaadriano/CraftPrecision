import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import { ProductionBatch, ScrapEntry } from '../types/operations';
import { LotTag } from './ChannelBadge';

interface QualityScrapViewProps {
  batches: ProductionBatch[];
  scrapLedger: ScrapEntry[];
  onApproveQC: (batchId: string) => void;
  onOpenScrapModal: (batch: ProductionBatch) => void;
}

export const QualityScrapView: React.FC<QualityScrapViewProps> = ({
  batches,
  scrapLedger,
  onApproveQC,
  onOpenScrapModal,
}) => {
  const qcPendingBatches = batches.filter(
    (b) => b.qcStatus === 'Pendente' || b.currentStageIndex === 3
  );
  const totalScrapM3 = scrapLedger.reduce((acc, s) => acc + s.volumeM3, 0);

  return (
    <div className="space-y-6">
      {/* QC Inspection Bench */}
      <section className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#2A323D] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-semibold text-[#171C23] dark:text-[#EDF1FB]">
              Bancada de Inspeção Dimensional &amp; Acabamento (QC)
            </h2>
            <p className="text-xs text-[#575F6C] dark:text-[#9AA4B2] mt-0.5">
              Critérios de liberação: desvio dimensional máx. ±0.20 mm · umidade 7.0%–10.5% MC · selagem uniforme.
            </p>
          </div>
          <span className="font-mono text-xs font-medium text-[#6F4315] dark:text-[#F9BA82] tabular-nums">
            {qcPendingBatches.length} lotes aguardando conferência
          </span>
        </div>

        <div className="divide-y divide-[#E5E7EB] dark:divide-[#2A323D]">
          {qcPendingBatches.length === 0 ? (
            <div className="p-8 text-center">
              <ShieldCheck className="w-8 h-8 text-[#2E7D32] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#171C23] dark:text-[#EDF1FB]">
                Todos os lotes ativos foram inspecionados pelo QC.
              </p>
            </div>
          ) : (
            qcPendingBatches.map((batch) => {
              const withinTolerance = batch.toleranceDeltaMm <= 0.2;
              const withinMoisture =
                batch.moisturePct >= 6.5 && batch.moisturePct <= 10.5;
              const readyToPass = withinTolerance && withinMoisture;

              return (
                <div
                  key={batch.id}
                  className="px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <LotTag lotId={batch.id} />
                      <span className="text-[13px] font-semibold text-[#171C23] dark:text-[#EDF1FB]">
                        {batch.itemName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Ruler className="w-3.5 h-3.5 text-[#8B5A2B]" />
                        Desvio medido:{' '}
                        <strong
                          className={
                            withinTolerance
                              ? 'text-[#2E7D32] dark:text-[#88D982]'
                              : 'text-[#DC2626] dark:text-[#FCA5A5]'
                          }
                        >
                          ±{batch.toleranceDeltaMm.toFixed(2)} mm
                        </strong>
                      </span>
                      <span className="font-mono">
                        Umidade:{' '}
                        <strong
                          className={
                            withinMoisture
                              ? 'text-[#2E7D32] dark:text-[#88D982]'
                              : 'text-[#DC2626] dark:text-[#FCA5A5]'
                          }
                        >
                          {batch.moisturePct.toFixed(1)}% MC
                        </strong>
                      </span>
                      <span>Acabamento: {batch.finishSpec}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenScrapModal(batch)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#DC2626] hover:bg-[#BA1A1A] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Registrar Refugo / Retrabalho</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onApproveQC(batch.id)}
                      disabled={!readyToPass}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#2E7D32] hover:bg-[#005B14] disabled:opacity-45 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aprovar QC</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Scrap & Rework Ledger */}
      <section className="bg-white dark:bg-[#1E232A] border border-[#E5E7EB] dark:border-[#2A323D] rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E5E7EB] dark:border-[#2A323D] flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-sm font-semibold text-[#171C23] dark:text-[#EDF1FB]">
            Livro de Registro de Refugos &amp; Reaproveitamento
          </h2>
          <span className="font-mono text-xs font-semibold text-[#BA1A1A] dark:text-[#FCA5A5] tabular-nums">
            Volume total perdido: {totalScrapM3.toFixed(4)} m³
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#2C3440] dark:bg-[#12161B] text-[#EDF1FB] text-[11px] font-medium">
                <th className="py-2.5 px-4 whitespace-nowrap">Registro</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Data / Hora</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Lote Origem</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Espécie</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Volume (m³)</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Motivo Técnico</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Estação / Operador</th>
                <th className="py-2.5 px-4 whitespace-nowrap">Destinação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2A323D] text-[13px]">
              {scrapLedger.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className={
                    idx % 2 === 0
                      ? 'bg-white dark:bg-[#1E232A]'
                      : 'bg-[#F8F9FA] dark:bg-[#191D23]'
                  }
                >
                  <td className="py-2.5 px-4 whitespace-nowrap font-mono text-xs font-semibold text-[#171C23] dark:text-[#EDF1FB]">
                    {entry.id}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-mono text-xs text-[#575F6C] dark:text-[#9AA4B2] tabular-nums">
                    {entry.timestamp}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <LotTag lotId={entry.lotId} />
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-xs font-medium text-[#171C23] dark:text-[#EDF1FB]">
                    {entry.species}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-right font-mono text-xs font-semibold text-[#BA1A1A] dark:text-[#FCA5A5] tabular-nums">
                    {entry.volumeM3.toFixed(4)}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-[#171C23] dark:text-[#D6DAE4] max-w-xs">
                    {entry.reason}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-xs text-[#575F6C] dark:text-[#9AA4B2]">
                    {entry.stationName} · {entry.operatorName}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded border text-[11px] font-medium ${
                        entry.disposition === 'Descarte'
                          ? 'bg-[#FFDAD6] dark:bg-[#3B1313] border-[#DC2626]/45 text-[#93000A] dark:text-[#FCA5A5]'
                          : entry.disposition === 'Retrabalho'
                          ? 'bg-[#FEF3C7] dark:bg-[#3A280A] border-[#D97706]/45 text-[#B45309] dark:text-[#FBBF24]'
                          : 'bg-[#E8F5E9] dark:bg-[#122D16] border-[#2E7D32]/40 text-[#005B14] dark:text-[#88D982]'
                      }`}
                    >
                      {entry.disposition}
                    </span>
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
