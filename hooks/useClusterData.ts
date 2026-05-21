import { useQuery } from "@tanstack/react-query";
import { clusters as staticClusters } from "@/lib/data";
import { transformProducts, type DJProduct } from "@/lib/transform";
import type { Cluster } from "@/lib/data";

async function fetchClusters(): Promise<Cluster[]> {
  const res = await fetch(
    "https://dummyjson.com/products?limit=24&select=id,title,price,rating,category"
  );
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return transformProducts(json.products as DJProduct[]);
}

export function useClusterData() {
  return useQuery<Cluster[]>({
    queryKey: ["clusters"],
    queryFn: fetchClusters,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export { staticClusters };
