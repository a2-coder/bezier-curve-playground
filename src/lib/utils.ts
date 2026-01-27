import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Point } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get closest point to a path
 * @param path - The svg path element
 * @param point - The point to find the closest point on the path
 * @returns The closest point on the path and the length of the path
 */
export function getClosestPointOnPath(path: SVGPathElement, point: Point) {
  const totalLength = path.getTotalLength();
  let step = totalLength / 20;
  let closest: DOMPoint = path.getPointAtLength(0);
  let distance = Infinity;
  let length = 0;
  for (let l = 0; l <= totalLength; l += step) {
    const p = path.getPointAtLength(l);
    const d = Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2);
    if (d < distance) {
      distance = d;
      closest = p;
      length = l;
    }
  }
  // refine the closest point using binary search
  while (step > 0.001) {
    step /= 2;
    const p = path.getPointAtLength(length - step);
    const d = Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2);
    if (d < distance) {
      distance = d;
      closest = p;
      length = length - step;
    } else {
      length = length + step;
    }
  }

  return { closest, length, distance };
}

/**
 * Interpolate between two points
 * @param from The starting point
 * @param to The ending point
 * @param t The interpolation parameter
 * @returns The interpolated point
 */
export function interpolate(from: Point, to: Point, t: number): Point {
  return {
    x: (1 - t) * from.x + t * to.x,
    y: (1 - t) * from.y + t * to.y,
  };
}
