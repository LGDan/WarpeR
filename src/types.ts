/**
 * Effect function: takes source ImageData, writes to destination (or returns new ImageData).
 * Width/height are the same for in/out; dest may be the same as src for in-place.
 */
export type EffectFn = (
  src: ImageData,
  dest: ImageData
) => void;

export interface RegistryEntry {
  name: string;
  apply: EffectFn;
}
