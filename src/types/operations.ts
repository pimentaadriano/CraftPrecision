export type ProductionStageKey =
  | 'Corte'
  | 'Usinagem'
  | 'Acabamento'
  | 'QC'
  | 'Embalagem'
  | 'Expedição';

export const PRODUCTION_STAGES: ProductionStageKey[] = [
  'Corte',
  'Usinagem',
  'Acabamento',
  'QC',
  'Embalagem',
  'Expedição',
];

export type MarketplaceChannel =
  | 'Mercado Livre'
  | 'Shopee'
  | 'Amazon'
  | 'Elo7'
  | 'B2B Sob Medida';

export type WoodSpecies =
  | 'Freijó'
  | 'Cumaru'
  | 'Tauari'
  | 'Carvalho Americano'
  | 'MDF Naval'
  | 'Compensado Birch';

export type GrainDirection = 'Longitudinal' | 'Transversal' | 'Livre';

export type ScreenKey =
  | 'overview'
  | 'inventory'
  | 'stations'
  | 'marketplace'
  | 'quality';

export interface DimensionsMm {
  t: number; // thickness
  w: number; // width
  l: number; // length
}

export interface ProductionBatch {
  id: string; // e.g., LOT#8842-FRJ
  itemName: string;
  sku: string;
  species: WoodSpecies;
  channel: MarketplaceChannel;
  orderCode: string; // e.g., MLB-90418274
  quantity: number;
  currentStageIndex: number; // 0..5
  stageTimesMin: number[]; // cycle times per stage in minutes
  assignedStationId: string;
  assignedArtisanId: string;
  priority: 'Urgente' | 'Padrão' | 'Agendado';
  moisturePct: number;
  dimensionsMm: DimensionsMm;
  dueLabel: string;
  finishSpec: string;
  qcStatus: 'Pendente' | 'Aprovado' | 'Retrabalho';
  toleranceDeltaMm: number;
}

export interface LumberLot {
  lotId: string;
  species: WoodSpecies;
  dimensionsMm: DimensionsMm;
  unitsAvailable: number;
  cubicMeters: number;
  moisturePct: number;
  grainDirection: GrainDirection;
  certification: 'FSC 100%' | 'DOF Validado' | 'CARB2';
  status: 'Disponível' | 'Alocado' | 'Estoque Baixo' | 'Rejeitado';
  locationBay: string;
  costPerUnitBrl: number;
}

export interface WorkStation {
  id: string;
  name: string;
  machineModel: string;
  zone: string;
  status: 'Operando' | 'Manutenção' | 'Ocioso';
  utilizationPct: number;
  currentBatchId: string | null;
  spindleHours: number;
  calibrationIntervalHours: number;
  operatorId: string;
}

export interface Artisan {
  id: string;
  name: string;
  initials: string;
  role: string;
  specialization: string;
  stationId: string;
  efficiencyPct: number;
  shift: 'Turno A (06h–14h)' | 'Turno B (14h–22h)';
}

export interface MarketplaceOrder {
  orderId: string;
  channel: Exclude<MarketplaceChannel, 'B2B Sob Medida'>;
  customerName: string;
  cityState: string;
  productTitle: string;
  species: WoodSpecies;
  finishSpec: string;
  dimensionsMm: DimensionsMm;
  qty: number;
  totalValueBrl: number;
  slaDeadline: string;
  syncState: 'Sincronizado' | 'Etiqueta Pronta' | 'Aguardando Corte';
  packSlipGenerated: boolean;
  linkedBatchId: string | null;
}

export interface ScrapEntry {
  id: string;
  timestamp: string;
  lotId: string;
  species: WoodSpecies;
  dimensionsMm: DimensionsMm;
  volumeM3: number;
  reason: string;
  stationName: string;
  operatorName: string;
  disposition: 'Descarte' | 'Retrabalho' | 'Reaproveitamento';
}
