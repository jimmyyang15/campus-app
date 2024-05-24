import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// // Service Workers
// export async function registerServiceWorker() {
//   if(!("serviceWorker" in navigator)) {
//     throw Error("Service workers are not supported by this browser")
//   }
//   await navigator.serviceWorker.register("../app/sw.ts")
// }

// export async function getReadyServiceWorker() {
//   if(!("serviceWorker" in navigator)) {
//     throw Error("Service workers are not supported by this browser")

//   }
//   return navigator.serviceWorker.ready; 
// }