import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export function basePathName(url) {
  return url.split("/")[url.split("/").length - 1];
}

export function clearLine(str) {
  return str.trim().replace(/\n/g, "").replace(/\s+/g, " ").trim();
}

export function clearChanelName(name){
    return name.split('@').pop()
}

export function subInt(str) {
  let arr = str.split(" ");
  arr.pop();
  return +arr.join("");
}

export const sleep = (waitTimeInMs) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

const maxDuration = 5000
export const randomDuration = () => Math.random() * maxDuration

export const randomFromInterval = (min, max) => Math.random() * (max - min + 1) + min

export function isPrivate(str){
  return str.toLowerCase() == 'приватный канал'
}
