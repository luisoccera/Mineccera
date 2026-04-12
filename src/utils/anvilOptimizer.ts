import { SelectedEnchantment } from '../data/enchantments';

interface Node {
  hasItem: boolean;
  mask: number;
  uses: number;
}

export interface AnvilStep {
  cost: number;
  description: string;
}

export interface AnvilPlanResult {
  maxStepCost: number;
  overflowSteps: number;
  steps: AnvilStep[];
  totalCost: number;
}

interface InternalResult extends AnvilPlanResult {}

const STEP_LIMIT = 39;

const anvilPenalty = (uses: number) => 2 ** uses - 1;

const toKey = (nodes: Node[]) =>
  nodes
    .slice()
    .sort((a, b) => Number(a.hasItem) - Number(b.hasItem) || a.mask - b.mask || a.uses - b.uses)
    .map((node) => `${node.hasItem ? 'I' : 'B'}:${node.mask}:${node.uses}`)
    .join('|');

const isBetter = (candidate: InternalResult, best: InternalResult | null) => {
  if (!best) {
    return true;
  }

  if (candidate.overflowSteps !== best.overflowSteps) {
    return candidate.overflowSteps < best.overflowSteps;
  }

  if (candidate.totalCost !== best.totalCost) {
    return candidate.totalCost < best.totalCost;
  }

  if (candidate.maxStepCost !== best.maxStepCost) {
    return candidate.maxStepCost < best.maxStepCost;
  }

  return candidate.steps.length < best.steps.length;
};

export function optimizeAnvilOrder(enchantments: SelectedEnchantment[]): AnvilPlanResult | null {
  if (!enchantments.length) {
    return null;
  }

  if (enchantments.length > 8) {
    return null;
  }

  const targetMask = (1 << enchantments.length) - 1;
  const costMemo = new Map<number, number>();
  const solveMemo = new Map<string, InternalResult | null>();

  const maskCost = (mask: number) => {
    const cached = costMemo.get(mask);
    if (cached !== undefined) {
      return cached;
    }

    let cost = 0;
    enchantments.forEach((enchantment, index) => {
      if (mask & (1 << index)) {
        cost += enchantment.multiplier * enchantment.level;
      }
    });
    costMemo.set(mask, cost);

    return cost;
  };

  const maskNames = (mask: number) =>
    enchantments
      .filter((_, index) => mask & (1 << index))
      .map((enchantment) => `${enchantment.name} ${enchantment.level}`)
      .join(', ');

  const solve = (nodes: Node[]): InternalResult | null => {
    if (nodes.length === 1) {
      const node = nodes[0];
      if (node.hasItem && node.mask === targetMask) {
        return { maxStepCost: 0, overflowSteps: 0, steps: [], totalCost: 0 };
      }

      return null;
    }

    const key = toKey(nodes);
    if (solveMemo.has(key)) {
      return solveMemo.get(key) ?? null;
    }

    let best: InternalResult | null = null;
    const itemIndex = nodes.findIndex((node) => node.hasItem);
    const itemNode = nodes[itemIndex];

    nodes.forEach((candidateBook, bookIndex) => {
      if (bookIndex === itemIndex || candidateBook.hasItem) {
        return;
      }

      const stepCost =
        anvilPenalty(itemNode.uses) + anvilPenalty(candidateBook.uses) + maskCost(candidateBook.mask);
      const mergedNode: Node = {
        hasItem: true,
        mask: itemNode.mask | candidateBook.mask,
        uses: Math.max(itemNode.uses, candidateBook.uses) + 1,
      };

      const nextNodes = nodes.filter((_, index) => index !== itemIndex && index !== bookIndex);
      nextNodes.push(mergedNode);

      const child = solve(nextNodes);
      if (!child) {
        return;
      }

      const merged: InternalResult = {
        maxStepCost: Math.max(stepCost, child.maxStepCost),
        overflowSteps: child.overflowSteps + (stepCost > STEP_LIMIT ? 1 : 0),
        steps: [{ cost: stepCost, description: `Aplica ${maskNames(candidateBook.mask)} al objeto` }, ...child.steps],
        totalCost: child.totalCost + stepCost,
      };

      if (isBetter(merged, best)) {
        best = merged;
      }
    });

    for (let i = 0; i < nodes.length; i += 1) {
      if (nodes[i].hasItem) {
        continue;
      }

      for (let j = i + 1; j < nodes.length; j += 1) {
        if (nodes[j].hasItem) {
          continue;
        }

        const combinations: Array<[Node, Node, string]> = [
          [nodes[i], nodes[j], `${maskNames(nodes[i].mask)} + ${maskNames(nodes[j].mask)}`],
          [nodes[j], nodes[i], `${maskNames(nodes[j].mask)} + ${maskNames(nodes[i].mask)}`],
        ];

        combinations.forEach(([left, right, label]) => {
          const stepCost = anvilPenalty(left.uses) + anvilPenalty(right.uses) + maskCost(right.mask);
          const mergedNode: Node = {
            hasItem: false,
            mask: left.mask | right.mask,
            uses: Math.max(left.uses, right.uses) + 1,
          };

          const nextNodes = nodes.filter((_, index) => index !== i && index !== j);
          nextNodes.push(mergedNode);

          const child = solve(nextNodes);
          if (!child) {
            return;
          }

          const merged: InternalResult = {
            maxStepCost: Math.max(stepCost, child.maxStepCost),
            overflowSteps: child.overflowSteps + (stepCost > STEP_LIMIT ? 1 : 0),
            steps: [{ cost: stepCost, description: `Combina libros: ${label}` }, ...child.steps],
            totalCost: child.totalCost + stepCost,
          };

          if (isBetter(merged, best)) {
            best = merged;
          }
        });
      }
    }

    solveMemo.set(key, best);
    return best;
  };

  const initialNodes: Node[] = [
    { hasItem: true, mask: 0, uses: 0 },
    ...enchantments.map((_, index) => ({ hasItem: false, mask: 1 << index, uses: 0 })),
  ];

  return solve(initialNodes);
}
