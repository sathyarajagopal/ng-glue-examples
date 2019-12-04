export interface SymbolModel {
  ric: string;
  description: string;
  bid: number;
  ask: number;
}

export function toSymbolModel({ RIC: ric, Description: description }) {
  return {
    ric,
    description,
    ask: 0,
    bid: 0
  };
}
