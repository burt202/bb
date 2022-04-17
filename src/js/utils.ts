export function convertNameToId(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

export function round(decimals: number, num: number) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function getPercentage(rawDataLength: number, portionLength: number) {
  if (rawDataLength === 0) return "0%"
  return `${round(0, (portionLength / rawDataLength) * 100)}%`
}

export const stageNameMap = {
  winner: "Winner",
  final: "Final",
  semi: "Semi-Final",
  quarter: "Quarter-Final",
  roundof16: "Round Of 16",
  roundof32: "Round Of 32",
  qualifier: "Qualifier",
  playoff: "Playoff",
  season: "Season",
  prequalifier: "Pre-Qualifier",
} as Record<string, string>
