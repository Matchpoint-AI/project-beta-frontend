/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(callback: any, delay: any) {
  let timer: any;
  return function (...args: any) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
