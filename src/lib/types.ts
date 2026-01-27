export interface Configuration {
  size: number;
  startX: number;
  startY: number;
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  endX: number;
  endY: number;
  t: number;
}
export type ConfigurationAction<
  K extends keyof Configuration = keyof Configuration,
> = {
  key: K;
  value: Configuration[K];
};

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  w: number;
  h: number;
};
