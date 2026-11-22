import React from 'react';
import { Check } from 'lucide-react';
import { PRODUCTION_STAGES } from '../types/operations';

interface StageTimelineProps {
  currentStageIndex: number;
  stageTimesMin: number[];
  compact?: boolean;
  onSelectStage?: (index: number) => void;
}

export const StageTimeline: React.FC<StageTimelineProps> = ({
  currentStageIndex,
  stageTimesMin,
  compact = false,
  onSelectStage,
}) => {
  return (
    <div className="w-full" role="list" aria-label="Etapas de Produção">
      <div className="grid grid-cols-6 items-start relative">
        {PRODUCTION_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStageIndex;
          const isActive = idx === currentStageIndex;
          const isQueued = idx > currentStageIndex;
          const minutes = stageTimesMin[idx] ?? 0;

          return (
            <div
              key={stage}
              role="listitem"
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector Line to next node */}
              {idx < PRODUCTION_STAGES.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`absolute top-3 left-1/2 w-full h-0.5 ${
                    idx < currentStageIndex
                      ? 'bg-[#2E7D32] dark:bg-[#4CAF50]'
                      : 'border-t border-dashed border-[#BFC7D6] dark:border-[#3F4754]'
                  }`}
                />
              )}

              {/* Stage Node */}
              <button
                type="button"
                onClick={() => onSelectStage?.(idx)}
                disabled={!onSelectStage}
                title={`${stage} — ${
                  isCompleted
                    ? `Concluído (${minutes} min)`
                    : isActive
                    ? `Em execução (${minutes} min)`
                    : 'Na fila'
                }`}
                className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5A2B] ${
                  onSelectStage ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                } ${
                  isCompleted
                    ? 'bg-[#2E7D32] text-white border border-[#005B14]'
                    : isActive
                    ? 'bg-white dark:bg-[#1E232A] border-2 border-[#8B5A2B] text-[#8B5A2B] shadow-[0_0_0_3px_rgba(139,90,43,0.16)]'
                    : 'bg-[#F0F4FD] dark:bg-[#161A1F] border border-[#BFC7D6] dark:border-[#3F4754] text-[#575F6C] dark:text-[#8B95A5]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-[#8B5A2B]" />
                ) : (
                  <span className="font-mono text-[10px] font-medium">
                    {idx + 1}
                  </span>
                )}
              </button>

              {/* Label */}
              <span
                className={`mt-1.5 text-[11px] leading-tight whitespace-nowrap ${
                  isActive
                    ? 'font-semibold text-[#6F4315] dark:text-[#F9BA82]'
                    : isCompleted
                    ? 'font-medium text-[#171C23] dark:text-[#EDF1FB]'
                    : 'font-normal text-[#575F6C] dark:text-[#8B95A5]'
                }`}
              >
                {stage}
              </span>

              {/* Monospace Cycle Time */}
              {!compact && (
                <span className="mt-0.5 font-mono text-[10px] text-[#575F6C] dark:text-[#8B95A5] tabular-nums">
                  {isCompleted
                    ? `${minutes} min`
                    : isActive
                    ? `${minutes > 0 ? minutes : 12}m ativa`
                    : isQueued
                    ? '—'
                    : ''}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
