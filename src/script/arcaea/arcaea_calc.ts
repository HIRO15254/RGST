export function scoreToRate(cons: number, score: number) {
  if (score < 9800000) {
    return Math.max(cons + (score - 9500000) / 300000, 0);
  } else {
    return Math.min(cons + 2, cons + (score - 9600000) / 200000);
  }
}
