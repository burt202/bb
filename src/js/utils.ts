export function convertNameToId(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

export const stageNameMap = {
  winner: "Winner",
  final: "Final",
  semi: "Semi-Final",
  quarter: "Quarter-Final",
  roundof16: "Round Of 16",
  roundof32: "Round Of 32",
  qualifier: "Qualifier",
  season: "Season",
  prequalifier: "Pre-Qualifier",
} as Record<string, string>
