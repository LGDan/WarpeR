import type { RegistryEntry } from "../types.js";

const registry = new Map<number, RegistryEntry>();

export function register(id: number, entry: RegistryEntry): void {
  registry.set(id, entry);
}

export function get(id: number): RegistryEntry | undefined {
  return registry.get(id);
}

export function getName(id: number): string {
  const entry = registry.get(id);
  return entry ? entry.name : "—";
}

export function has(id: number): boolean {
  return registry.has(id);
}

export function getAllIds(): number[] {
  return [...registry.keys()].sort((a, b) => a - b);
}
