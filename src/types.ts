/**
 * Effect function: takes source ImageData, writes to destination.
 * dest dimensions match getOutputSize(src.width, src.height) or (src.width, src.height) if omitted.
 */
export type EffectFn = (
  src: ImageData,
  dest: ImageData
) => void;

export interface RegistryEntry {
  name: string;
  apply: EffectFn;
  /** If set, the effect output has different dimensions (e.g. 90° rotation). */
  getOutputSize?: (width: number, height: number) => { width: number; height: number };
}
