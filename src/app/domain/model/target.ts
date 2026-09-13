export interface Target {
  id: string;

  name: string;
  description: string | null;

  skillId: string;

  motivation: Motivation[];
  tradeOffs: TradeOff[];

  weeklyCommitmentInMinutes: number;
}

export interface Motivation {
  statement: string;
}

interface TradeOff {
  statement: string;
}
