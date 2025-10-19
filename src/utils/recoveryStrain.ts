export const categoryWeights = {
  restorative: { base_recovery: 2.0, base_strain: 0.0 },
  neutral: { base_recovery: 0.5, base_strain: 0.2 },
  mixed: { base_recovery: 1.0, base_strain: 0.8 },
  depleting: { base_recovery: 0.0, base_strain: 2.0 },
} as const;

export type ActivityKind = keyof typeof categoryWeights;

export interface ScaleScores {
  process: number;
  result: number;
  energy: number;
  stress: number;
}

export interface RecoveryStrainResult {
  recovery: number;
  strain: number;
  delta: number;
}

export function calcScores(
  kind: ActivityKind,
  s: ScaleScores
): RecoveryStrainResult {
  const cw = categoryWeights[kind];
  const recovery = cw.base_recovery + 0.3 * s.process + 0.2 * s.result;
  const strain = cw.base_strain + 0.3 * s.energy + 0.4 * s.stress;
  return { recovery, strain, delta: recovery - strain };
}

export interface DayItem {
  kind: ActivityKind;
  process: number;
  result: number;
  energy: number;
  stress: number;
}

export interface DayAggregate {
  recovery: number;
  strain: number;
  delta: number;
}

export function aggregateDay(items: DayItem[]): DayAggregate {
  const result = items.reduce(
    (acc, it) => {
      const { recovery, strain } = calcScores(it.kind, {
        process: it.process,
        result: it.result,
        energy: it.energy,
        stress: it.stress,
      });
      acc.recovery += recovery;
      acc.strain += strain;
      return acc;
    },
    { recovery: 0, strain: 0 }
  );

  return {
    recovery: result.recovery,
    strain: result.strain,
    delta: result.recovery - result.strain,
  };
}

export function getBalanceStatus(delta: number): {
  status: "critical" | "warning" | "good";
  label: string;
  color: string;
} {
  if (delta <= -3) {
    return {
      status: "critical",
      label: "Высокое напряжение",
      color: "bg-red-500",
    };
  } else if (delta >= 3) {
    return {
      status: "good",
      label: "Хороший баланс",
      color: "bg-green-500",
    };
  } else {
    return {
      status: "warning",
      label: "Умеренное напряжение",
      color: "bg-yellow-500",
    };
  }
}
