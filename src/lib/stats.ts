/** Kendall's tau for two strict orderings of the same IDs after the app resolves score ties. */
export function kendallTau(left: readonly string[], right: readonly string[]): number | null {
  if (left.length !== right.length || left.length < 2) return null;
  const positions = new Map(right.map((id, index) => [id, index]));
  if (positions.size !== right.length || new Set(left).size !== left.length) return null;

  const order: number[] = [];
  for (const id of left) {
    const position = positions.get(id);
    if (position === undefined) return null;
    order.push(position);
  }

  let balance = 0;
  for (let i = 0; i < order.length; i++) {
    for (let j = i + 1; j < order.length; j++) {
      balance += order[i] < order[j] ? 1 : -1;
    }
  }
  return balance / ((order.length * (order.length - 1)) / 2);
}
