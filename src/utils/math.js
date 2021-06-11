import GSAP from 'gsap';

export function lerp(p1, p2, t) {
  return GSAP.utils.interpolate(p1, p2, t);
}

export function clamp(min, max, number) {
  return GSAP.utils.clamp(min, max, number);
}

export function random(min, max) {
  return GSAP.utils.random(min, max);
}

export function map(valueToMap, inMin, inMax, outMin, outMax) {
  return GSAP.utils.mapRange(inMin, inMax, outMin, outMax, valueToMap);
}

export function delay(ms) {
  // eslint-disable-next-line promise/param-names
  return new Promise((res) => GSAP.delayedCall(ms / 1000, res));
}

export function interpolate(start, end, value) {
  return start * (1.0 - value) + end * value;
}

export function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
