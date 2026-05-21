import type { Cluster, Namespace, Pod, ResourceMetrics } from "./data";

export interface DJProduct {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;
}

const GPU_CATEGORIES = new Set(["smartphones", "laptops", "tablets", "computers"]);

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function aggregateMetrics(
  nodes: ResourceMetrics[]
): Omit<ResourceMetrics, "efficiency"> & { efficiency: number } {
  const sum = (key: keyof Omit<ResourceMetrics, "efficiency">) =>
    nodes.reduce((acc, n) => acc + n[key], 0);
  return {
    cpu: sum("cpu"),
    ram: sum("ram"),
    storage: sum("storage"),
    network: sum("network"),
    gpu: sum("gpu"),
    efficiency: Math.round(nodes.reduce((a, n) => a + n.efficiency, 0) / nodes.length),
  };
}

function productToPod(p: DJProduct, podIndex: number): Pod {
  const base = Math.round(p.price * 14);
  return {
    id: `pod-${p.id}`,
    name: `Pod ${String.fromCharCode(65 + podIndex)}`,
    cpu: Math.round(base * 0.42),
    ram: Math.round(base * 0.22),
    storage: Math.round(base * 0.05),
    network: Math.round(base * 0.08),
    gpu: GPU_CATEGORIES.has(p.category) ? Math.round(base * 0.23) : 0,
    efficiency: clamp(Math.round((p.rating / 5) * 65 + 5), 5, 70),
  };
}

export function transformProducts(products: DJProduct[]): Cluster[] {
  // Need at least 24 products: 4 clusters × 3 namespaces × 2 pods
  if (!products || products.length < 12) {
    throw new Error("Insufficient products from API");
  }

  const clusterNames = ["Cluster A", "Cluster B", "Cluster C", "Cluster D"];
  const nsNames = ["Namespace A", "Namespace B", "Namespace C"];

  // Pad to 24 by cycling if needed
  const padded = Array.from({ length: 24 }, (_, i) => products[i % products.length]);

  return clusterNames.map((clusterName, ci) => {
    const namespaces: Namespace[] = nsNames.map((nsName, ni) => {
      const podA = productToPod(padded[ci * 6 + ni * 2], 0);
      const podB = productToPod(padded[ci * 6 + ni * 2 + 1], 1);
      const pods = [podA, podB];
      return {
        id: `ns-${ci}-${ni}`,
        name: nsName,
        pods,
        ...aggregateMetrics(pods),
      };
    });

    return {
      id: `cluster-${ci}`,
      name: clusterName,
      namespaces,
      ...aggregateMetrics(namespaces),
    };
  });
}
